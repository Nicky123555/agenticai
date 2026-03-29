import "dotenv/config";
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

async function run() {
  const tasks = await db.collection("tasks").orderBy("createdAt", "desc").limit(10).get();
  console.log("LAST 10 TASKS:");
  tasks.docs.forEach(d => {
    const t = d.data();
    console.log(`Title: ${t.title} | Status: ${t.status} | AssignedTo: ${t.assignedTo}`);
  });
  
  const projects = await db.collection("projects").orderBy("createdAt", "desc").limit(1).get();
  if (!projects.empty) {
    console.log("Latest Project:", projects.docs[0].id);
  }
}

run().catch(console.error).finally(() => process.exit());
