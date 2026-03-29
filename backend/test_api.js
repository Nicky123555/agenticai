import http from "http";
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
  const tasks = await db.collection("tasks").where("status", "==", "unassigned").limit(1).get();
  if (tasks.empty) return console.log("No unassigned projects");
  const projectId = tasks.docs[0].data().projectId;
  console.log("Testing assign-tasks for projectId:", projectId);

  const reqData = JSON.stringify({ projectId });
  const options = {
    hostname: "localhost",
    port: 3002,
    path: "/api/assign-tasks",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(reqData)
    }
  };

  const req = http.request(options, (res) => {
    let raw = "";
    res.on("data", chunk => raw += chunk);
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      console.log("Body:", raw);
    });
  });

  req.on("error", console.error);
  req.write(reqData);
  req.end();
}
run();
