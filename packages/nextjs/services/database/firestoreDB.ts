import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const getFirestoreConnector = () => {
  // Not sure if this is the best way to do this
  // But if not, the app gives an error that the app has already been initialized.
  if (getApps().length > 0) {
    return getFirestore();
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("Initializing LIVE Firestore with GOOGLE_APPLICATION_CREDENTIALS");
    initializeApp({
      credential: applicationDefault(),
    });
  } else if (process.env.FIREBASE_PRIVATE_KEY) {
    console.log("Initializing LIVE Firestore with FIREBASE_PRIVATE_KEY");
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } else {
    console.log("Initializing local Firestore instance");
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  return getFirestore();
};

export { getFirestoreConnector };
