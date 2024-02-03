import { getFirestoreConnector } from "./firestoreDB";
import { BuilderData } from "./schema";
import { DocumentData } from "firebase-admin/firestore";

const firestoreDB = getFirestoreConnector();
const getUserDoc = (id: string) => firestoreDB.collection("users").doc(id);
const getUserSnapshotById = (id: string) => getUserDoc(id).get();

export const findUserByAddress = async (builderAddress: string): Promise<{ exists: boolean; data?: BuilderData }> => {
  const builderSnapshot = await getUserSnapshotById(builderAddress);
  if (!builderSnapshot.exists) {
    return { exists: false };
  }
  const data = builderSnapshot.data() as DocumentData;
  return { exists: true, data: { id: builderSnapshot.id, ...data } };
};
