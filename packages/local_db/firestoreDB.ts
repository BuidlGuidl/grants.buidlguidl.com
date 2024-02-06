import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const getFirestoreConnector = () => {
  if (getApps().length > 0) {
    return getFirestore();
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("Initializing LIVE Firestore");
    initializeApp({
      credential: applicationDefault(),
    });
  } else {
    console.log("Initializing local Firestore instance");
    initializeApp({
      projectId: "buidlguidl",
    });
  }

  return getFirestore();
};

export { getFirestoreConnector };
