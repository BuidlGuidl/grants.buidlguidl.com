import { getFirestoreConnector } from "./firestoreDB";
import { BuilderData, GrantData, GrantDataWithBuilder } from "./schema";
import ecosystemGrants from "~~/services/database/ecosystemGrants.json";
import { findUserByAddress } from "~~/services/database/users";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";

const firestoreDB = getFirestoreConnector();
const grantsCollection = firestoreDB.collection("grants");
const getGrantsDoc = (id: string) => grantsCollection.doc(id);
const getGrantSnapshotById = (id: string) => getGrantsDoc(id).get();

export const createGrant = async (grantData: Omit<GrantData, "id" | "proposedAt" | "status">) => {
  try {
    const timestamp = new Date().getTime();
    const status = PROPOSAL_STATUS.PROPOSED;

    const grantRef = await grantsCollection.add({ ...grantData, proposedAt: timestamp, status });
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

export const getAllCompletedGrants = async (limit?: number) => {
  try {
    let query = grantsCollection.where("status", "==", PROPOSAL_STATUS.COMPLETED).orderBy("completedAt", "desc");

    if (limit) {
      query = query.limit(limit);
    }

    const grantsSnapshot = await query.get();
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

export const getAllActiveGrants = async () => {
  try {
    const grantsSnapshot = await grantsCollection.where("status", "==", PROPOSAL_STATUS.APPROVED).get();
    const grants: GrantData[] = [];
    grantsSnapshot.forEach(doc => {
      grants.push({ id: doc.id, ...doc.data() } as GrantData);
    });
    return grants;
  } catch (error) {
    console.error("Error getting all active grants:", error);
    throw error;
  }
};

// Get all the data from ecosystemGrants.json and update the amountGranted for Jessy's grant
export const getAllEcosystemGrants = async () => {
  const withdrawEventsSnapshot = await firestoreDB.collection("events").where("type", "==", "cohort.withdraw").get();
  const totalEthWithdrawnForJessy = withdrawEventsSnapshot.docs.reduce((acc, event) => {
    const payload = event.data().payload;
    if (payload.cohortName.includes("Jessy")) {
      return acc + Number(payload.amount);
    }
    return acc;
  }, 0);

  ecosystemGrants.grants[0].amountGranted = totalEthWithdrawnForJessy.toString();
  return ecosystemGrants;
};

type ReviewGrantParams = {
  grantId: string;
  action: ProposalStatusType;
  txHash: string;
  txChainId: string;
};
export const reviewGrant = async ({ grantId, action, txHash, txChainId }: ReviewGrantParams) => {
  try {
    const validActions = Object.values(PROPOSAL_STATUS);
    if (!validActions.includes(action)) {
      throw new Error(`Invalid action: ${action}`);
    }

    // Prepare the data to update based on the action
    const updateData: Record<string, any> = { status: action };

    // Add/update the transaction hash based on the action
    if (action === PROPOSAL_STATUS.APPROVED) {
      updateData["approvedTx"] = txHash;
      updateData["txChainId"] = txChainId; // Add txChainId when the grant is approved
    } else if (action === PROPOSAL_STATUS.COMPLETED) {
      updateData["completedTx"] = txHash;
    }

    // Update timestamp based on the action
    const grantActionTimeStamp = new Date().getTime();
    const grantActionTimeStampKey = `${action}At`;
    updateData[grantActionTimeStampKey] = grantActionTimeStamp;

    await grantsCollection.doc(grantId).update(updateData);
  } catch (error) {
    console.error("Error processing the grant:", error);
    throw error;
  }
};

export const getGrantsStats = async () => {
  // total_eth_granted is the summation of askAmount of all completed grants
  // total_active_grants is the count of grants with status "approved"
  // total_grants is the summation of completed and active grants
  try {
    const completedGrants = await getAllCompletedGrants();
    const total_eth_granted = completedGrants.reduce((acc, grant) => acc + grant.askAmount, 0);
    const total_completed_grants = completedGrants.length;

    const approvedGrantsSnapshot = await grantsCollection.where("status", "==", PROPOSAL_STATUS.APPROVED).get();
    const total_active_grants = approvedGrantsSnapshot.size;

    const total_grants = total_completed_grants + total_active_grants;

    return {
      total_grants,
      total_eth_granted,
      total_active_grants,
    };
  } catch (error) {
    console.error("Error getting grants stats:", error);
    throw error;
  }
};

export const getGrantById = async (grantId: string) => {
  try {
    const grantSnapshot = await getGrantSnapshotById(grantId);
    if (!grantSnapshot.exists) {
      return null;
    }
    return { id: grantSnapshot.id, ...grantSnapshot.data() } as GrantData;
  } catch (error) {
    console.error("Error getting grant by id:", error);
    throw error;
  }
};

export const submitGrantBuild = async (grantId: string, link: string) => {
  const status = PROPOSAL_STATUS.SUBMITTED;
  const grantActionTimeStamp = new Date().getTime();
  const grantActionTimeStampKey = (status + "At") as `${typeof status}At`;

  try {
    await getGrantsDoc(grantId).update({ status, link, [grantActionTimeStampKey]: grantActionTimeStamp });
  } catch (error) {
    console.error("Error updating the grant status:", error);
    throw error;
  }
};
