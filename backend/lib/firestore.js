// ============================================================
// lib/firestore.js
// Firestore helper functions for reading, writing, and logging
// ============================================================

import admin from "firebase-admin";

// -------------------------------------------------------
// INITIALIZE FIREBASE ADMIN (only once)
// Uses environment variables for credentials
// -------------------------------------------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key comes with escaped newlines — fix them
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

// ============================================================
// 📋 TASKS COLLECTION HELPERS
// ============================================================

/**
 * Save a batch of tasks to Firestore
 * @param {string} projectId - The project these tasks belong to
 * @param {Array} tasks - Array of task objects from Architect Agent
 */
async function saveTasks(projectId, tasks) {
  const batch = db.batch();

  tasks.forEach((task) => {
    const taskRef = db.collection("tasks").doc(task.id);
    batch.set(taskRef, {
      ...task,
      projectId,
      status: "unassigned",       // unassigned → assigned → in_progress → submitted → complete
      assignedTo: null,
      submittedAt: null,
      score: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`✅ Saved ${tasks.length} tasks for project ${projectId}`);
}

/**
 * Get all unassigned tasks for a project
 * @param {string} projectId
 */
async function getUnassignedTasks(projectId) {
  const snapshot = await db
    .collection("tasks")
    .where("projectId", "==", projectId)
    .where("status", "==", "unassigned")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get a single task by ID
 * @param {string} taskId
 */
async function getTask(taskId) {
  const doc = await db.collection("tasks").doc(taskId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

/**
 * Update task fields
 * @param {string} taskId
 * @param {object} updates - Fields to update
 */
async function updateTask(taskId, updates) {
  await db.collection("tasks").doc(taskId).update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ============================================================
// 👥 USERS COLLECTION HELPERS
// ============================================================

/**
 * Get all users for a project (with their skills and workload)
 * @param {string} projectId
 */
async function getProjectUsers(projectId) {
  const snapshot = await db
    .collection("users")
    .where("projectId", "==", projectId)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get a single user by ID
 * @param {string} userId
 */
async function getUser(userId) {
  const doc = await db.collection("users").doc(userId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

/**
 * Update user XP, badges, and stats
 * @param {string} userId
 * @param {object} updates
 */
async function updateUser(userId, updates) {
  await db.collection("users").doc(userId).update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ============================================================
// 📁 PROJECTS COLLECTION HELPERS
// ============================================================

/**
 * Create a new project document
 * @param {object} projectData
 */
async function createProject(projectData) {
  const ref = await db.collection("projects").add({
    ...projectData,
    status: "planning",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

/**
 * Get project by ID
 * @param {string} projectId
 */
async function getProject(projectId) {
  const doc = await db.collection("projects").doc(projectId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

// ============================================================
// 📜 AUDIT LOGS — VERY IMPORTANT ⭐
// Every AI decision gets logged here for transparency
// ============================================================

/**
 * Write an audit log entry
 * This is called every time an AI agent makes a decision
 *
 * @param {object} log
 * @param {string} log.agent     - Which agent made the decision (e.g. "Architect Agent")
 * @param {string} log.action    - What decision was made (e.g. "Task assigned to user_123")
 * @param {string} log.reason    - WHY this decision was made
 * @param {string} log.projectId - Related project
 * @param {string} [log.taskId]  - Related task (optional)
 * @param {string} [log.userId]  - Related user (optional)
 * @param {object} [log.metadata]- Extra context data (optional)
 */
async function writeAuditLog(log) {
  await db.collection("logs").add({
    agent: log.agent,
    action: log.action,
    reason: log.reason,
    projectId: log.projectId || null,
    taskId: log.taskId || null,
    userId: log.userId || null,
    metadata: log.metadata || {},
    timestamp: new Date().toISOString(),    // Human-readable timestamp
    serverTime: admin.firestore.FieldValue.serverTimestamp(), // Firestore server time
  });
}

export {
  db,
  // Tasks
  saveTasks,
  getUnassignedTasks,
  getTask,
  updateTask,
  // Users
  getProjectUsers,
  getUser,
  updateUser,
  // Projects
  createProject,
  getProject,
  // Audit logs
  writeAuditLog,
};