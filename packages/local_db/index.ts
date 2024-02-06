import * as dotenv from "dotenv";
dotenv.config({ path: "../nextjs/.env.local" });

import { getFirestoreConnector } from "./firestoreDB.js";
import { importSeed } from "./utils.js";

const seedData = async () => {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("Connected to LIVE Firestore, exiting.");
    return;
  }

  const firestoreDB = getFirestoreConnector();
  try {
    await importSeed(firestoreDB);
  } catch (error) {
    console.error("Error seeding the data:", error);
  }
};

try {
  seedData();
} catch (error) {
  console.error("Error initializing seed data:", error);
}
