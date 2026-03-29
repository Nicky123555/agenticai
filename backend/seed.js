// ============================================================
// backend/seed.js
// Purpose: Initialize Firestore with test users
// ============================================================

const admin = require("firebase-admin");
const path = require("path");

// Load .env from the current directory (backend/)
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Safety Check: Ensure environment variables are loaded
const rawKey = process.env.FIREBASE_PRIVATE_KEY;
if (!rawKey) {
  console.error("❌ ERROR: FIREBASE_PRIVATE_KEY is missing!");
  console.log("Current Directory:", __dirname);
  console.log("Make sure your .env file is inside the 'backend' folder.");
  process.exit(1);
}

const privateKey = rawKey.replace(/\\n/g, "\n");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

async function seedUsers() {
  const users = [
    { name: "Alice", experienceLevel: "senior", skills: ["react", "nextjs", "css"], currentTaskCount: 0, xp: 0, tasksCompleted: 0 },
    { name: "Bob", experienceLevel: "mid", skills: ["node", "firebase", "api"], currentTaskCount: 0, xp: 0, tasksCompleted: 0 },
    { name: "Charlie", experienceLevel: "junior", skills: ["react", "node", "database"], currentTaskCount: 2, xp: 50, tasksCompleted: 1 }
  ];

  // Hardcoded for initial testing, but create-project.js will overwrite this later
  const TEST_PROJECT_ID = "Rxv4Zf3id7I4viUR8j4h";

  console.log("🚀 Seeding users into Firestore...");
  const batch = db.batch();
  
  users.forEach(user => {
    // Generate a new document reference with a random ID
    const ref = db.collection("users").doc();
    batch.set(ref, { ...user, projectId: TEST_PROJECT_ID });
  });

  try {
    await batch.commit();
    console.log(`✅ SUCCESS: Database seeded with ${users.length} users.`);
    console.log(`🔗 Users linked to Project ID: ${TEST_PROJECT_ID}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ SEEDING FAILED:", error);
    process.exit(1);
  }
}

seedUsers();