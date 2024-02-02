// Just to test Firebase Functions.
import { firestore } from "firebase-admin";
import { getFirestoreConnector } from "~~/services/database/firestoreDB";

import CollectionReference = firestore.CollectionReference;

const listCollections = async () => {
  const firestoreDB = getFirestoreConnector();
  let collections: CollectionReference[] = [];

  try {
    collections = await firestoreDB.listCollections();
  } catch (error) {
    console.error("Error listing collections:", error);
  }

  return collections;
};

export { listCollections };
