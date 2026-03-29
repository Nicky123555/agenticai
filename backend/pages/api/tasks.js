// backend/pages/api/tasks.js
import { db } from '../../lib/firestore.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const [tasksSnapshot, usersSnapshot, projectsSnapshot] = await Promise.all([
      db.collection('tasks').get(),
      db.collection('users').get(),
      db.collection('projects').get()
    ]);

    const usersMap = {};
    usersSnapshot.forEach(doc => { usersMap[doc.id] = doc.data().name; });

    const projectsMap = {};
    projectsSnapshot.forEach(doc => { projectsMap[doc.id] = doc.data().name; });

    const tasks = tasksSnapshot.docs.map((doc) => {
      const dbTask = doc.data();
      
      let status = dbTask.status;
      if (status === 'assigned' || status === 'todo') status = 'todo';
      else if (status === 'in_progress') status = 'in-progress';
      else if (status === 'complete' || status === 'done') status = 'done';
      else if (!status) status = 'unassigned';
      
      const assigneeName = dbTask.assignedTo ? (usersMap[dbTask.assignedTo] || dbTask.assignedTo) : '';
      
      return {
        id: doc.id,
        name: dbTask.title || 'Untitled Task',
        assignee: assigneeName,
        avatar: assigneeName ? assigneeName.charAt(0).toUpperCase() : '?',
        avatarColor: 'cyan',
        status: status,
        priority: dbTask.priority || 'medium',
        project: projectsMap[dbTask.projectId] || 'Unknown Project',
        deps: dbTask.deps || [],
        estimate: dbTask.estimatedHours ? `${dbTask.estimatedHours}h` : '1d'
      };
    });

    return res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks from Firestore' });
  }
}
