import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const getFirestoreConnector = () => {
  // Not sure if this is the best way to do this
  // But if not, the app gives an error that the app has already been initialized.
  if (getApps().length > 0) {
    return getFirestore();
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("Initializing LIVE Firestore");
    initializeApp({
      credential: applicationDefault(),
    });
  } else {
    // ToDo. Something is not working. Getting "Error: Could not load the default credentials."
    console.log("Initializing local Firestore instance");
    initializeApp({
      projectId: "buidlguidl-v3",
    });
  }

  return getFirestore();
};

export { getFirestoreConnector };
