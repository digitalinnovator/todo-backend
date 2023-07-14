// routes/tasks.js
const express = require('express');
const db = require('../db');

const router = express.Router();

// to Add a new task
router.post('/', async (req, res) => {
  try {
    const { task_name, task_type } = req.body;

    // Basic validation
    if (!task_name || !task_type) {
      return res.status(400).json({ error: 'Task name and task type are required.' });
    }

    // Additional validation for task_type
    if (task_type !== 'personal' && task_type !== 'professional') {
      return res.status(400).json({ error: 'Invalid task type. Only "personal" or "professional" are allowed.' });
    }

    const query = 'INSERT INTO tasks (task_name, task_type) VALUES ($1, $2) RETURNING *';
    const values = [task_name, task_type];
    const result = await db.query(query, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'An error occurred while adding the task.' });
  }
});

// to Get all tasks
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM tasks';
    const result = await db.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'An error occurred while getting the tasks.' });
  }
});

// to Delete a task by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Basic validation
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required.' });
    }

    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const result = await db.query(query, [taskId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'An error occurred while deleti.' });
  }
});

// to Mark a task as complete by ID
router.put('/:id/complete', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Basic validation
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required.' });
    }

    const checkQuery = 'SELECT * FROM tasks WHERE id = $1';
    const checkResult = await db.query(checkQuery, [taskId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const task = checkResult.rows[0];

    if (task.is_complete) {
      return res.status(400).json({ error: 'Task is already completed.' });
    }

    const query = 'UPDATE tasks SET is_complete = true WHERE id = $1 RETURNING *';
    const result = await db.query(query, [taskId]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking task as complete:', error);
    res.status(500).json({ error: 'An error occurred while marking the task as complete.' });
  }
});

// to Clear completed tasks
router.delete('/clear-completed', async (req, res) => {
  try {
    const { task_type } = req.query;

    // Basic validation
    if (!task_type || (task_type !== 'personal' && task_type !== 'professional')) {
      return res.status(400).json({ error: 'Invalid task type. Only "personal" or "professional" are allowed.' });
    }

    let query;
    if (task_type === 'personal') {
      query = `DELETE FROM tasks WHERE is_complete = true AND task_type = 'personal' RETURNING *`;
    } else {
      query = `DELETE FROM tasks WHERE is_complete = true AND task_type = 'professional' RETURNING *`;
    }

    const result = await db.query(query);

    const deletedTasks = result.rows;

    if (deletedTasks.length === 0) {
      return res.status(404).json({ error: 'No completed tasks found to delete.' });
    }

    res.json({ message: 'Completed tasks deleted successfully.', deletedTasks });
  } catch (error) {
    console.error('Error clearing completed tasks:', error);
    res.status(500).json({ error: 'An error occurred while clearing the completed tasks.' });
  }
});




module.exports = router;
