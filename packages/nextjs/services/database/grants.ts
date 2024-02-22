import { getFirestoreConnector } from "./firestoreDB";
import { BuilderData, GrantData, GrantDataWithBuilder } from "./schema";
import { findUserByAddress } from "~~/services/database/users";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";

const firestoreDB = getFirestoreConnector();
const grantsCollection = firestoreDB.collection("grants");
// const getGrantsDoc = (id: string) => grantsCollection.doc(id);
// const getGrantSnapshotById = (id: string) => getGrantsDoc(id).get();

export const createGrant = async (grantData: Omit<GrantData, "id" | "timestamp" | "status">) => {
  try {
    const timestamp = new Date().getTime();
    const status = PROPOSAL_STATUS.PROPOSED;

    const grantRef = await grantsCollection.add({ ...grantData, timestamp, status });
    const grantSnapshot = await grantRef.get();

    return { id: grantSnapshot.id, ...grantSnapshot.data() } as GrantData;
  } catch (error) {
    console.error("Error creating the grant:", error);
    throw error;
  }
};

export const getAllGrants = async () => {
  try {
    const grantsSnapshot = await grantsCollection.get();
    const grants: GrantData[] = [];
    grantsSnapshot.forEach(doc => {
      grants.push({ id: doc.id, ...doc.data() } as GrantData);
    });
    return grants;
  } catch (error) {
    console.error("Error getting all grants:", error);
    throw error;
  }
};

export const getAllGrantsForUser = async (userAddress: string) => {
  try {
    const grantsSnapshot = await grantsCollection.where("builder", "==", userAddress).get();
    const grants: GrantData[] = [];
    grantsSnapshot.forEach(doc => {
      grants.push({ id: doc.id, ...doc.data() } as GrantData);
    });
    return grants;
  } catch (error) {
    console.error("Error getting all grants for user:", error);
    throw error;
  }
};

export const getAllGrantsForReview = async () => {
  try {
    const grantsSnapshot = await grantsCollection
      .where("status", "in", [PROPOSAL_STATUS.PROPOSED, PROPOSAL_STATUS.SUBMITTED])
      .get();

    const grantsPromises = grantsSnapshot.docs.map(async doc => {
      const grantData = doc.data() as Omit<GrantData, "id">;
      const builderDataResponse = await findUserByAddress(grantData.builder);

      return {
        id: doc.id,
        ...grantData,
        builderData: builderDataResponse.exists ? (builderDataResponse.data as BuilderData) : undefined,
      } as GrantDataWithBuilder;
    });

    return await Promise.all(grantsPromises);
  } catch (error) {
    console.error("Error getting all completed grants:", error);
    throw error;
  }
};

export const getAllCompletedGrants = async () => {
  try {
    const grantsSnapshot = await grantsCollection.where("status", "==", PROPOSAL_STATUS.COMPLETED).get();
    const grants: GrantData[] = [];
    grantsSnapshot.forEach(doc => {
      grants.push({ id: doc.id, ...doc.data() } as GrantData);
    });
    return grants;
  } catch (error) {
    console.error("Error getting all completed grants:", error);
    throw error;
  }
};

export const reviewGrant = async (grantId: string, action: ProposalStatusType) => {
  try {
    await grantsCollection.doc(grantId).update({ status: action });
  } catch (error) {
    console.error("Error approving the grant:", error);
    throw error;
  }
};

export const getGrantsStats = async () => {
  // Summation of askAmount for completed grants: total_eth_granted
  // Total number of completed grants : total_completed_grants
  // Total number of submitted grants all grants : total_submitted_grants
  // Total number of Active grants (approved): total_active_grants
  try {
    const copmltedGrants = await getAllCompletedGrants();
    const total_eth_granted = copmltedGrants.reduce((acc, grant) => acc + grant.askAmount, 0);
    const total_completed_grants = copmltedGrants.length;

    const allGrantsSnapshot = await grantsCollection.get();
    const total_grants = allGrantsSnapshot.size;

    const approvedGrantsSnapshot = await grantsCollection.where("status", "==", PROPOSAL_STATUS.APPROVED).get();
    const total_active_grants = approvedGrantsSnapshot.size;

    return {
      total_grants,
      total_eth_granted,
      total_completed_grants,
      total_active_grants,
    };
  } catch (error) {
    console.error("Error getting grants stats:", error);
    throw error;
  }
};
