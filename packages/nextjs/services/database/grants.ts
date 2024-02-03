import { getFirestoreConnector } from "./firestoreDB";
import { GrantData } from "./schema";

const firestoreDB = getFirestoreConnector();
const grantsCollection = firestoreDB.collection("grants");
// const getGrantsDoc = (id: string) => grantsCollection.doc(id);
// const getGrantSnapshotById = (id: string) => getGrantsDoc(id).get();

export const createGrant = async (grantData: Omit<GrantData, "id" | "timestamp" | "status">) => {
  const timestamp = new Date().getTime();
  const status = "pending";

  const grantRef = await grantsCollection.add({ ...grantData, timestamp, status });
  const grantSnapshot = await grantRef.get();

  return { id: grantSnapshot.id, ...grantSnapshot.data() } as GrantData;
};
