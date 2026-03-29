// backend/pages/api/users.js
import { db } from '../../lib/firestore'; 
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  // CORS header to allow your frontend (port 3000) to read from backend (port 5000)
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetching the 25 seeded users from Firebase
    const querySnapshot = await getDocs(collection(db, "users"));
    const teamMembers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return res.status(200).json(teamMembers);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Failed to fetch users from Firebase" });
  }
}