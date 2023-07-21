// routes/tasks.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a new task
router.post('/', async (req, res) => {
  try {
    const { task_name, task_type } = req.body;

    // Create a new task in the database
    const newTask = await db.Task.create({ task_name, task_type });

    res.status(201).json(newTask);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errorMessages = error.errors.map((err) => err.message);
      return res.status(400).json({ error: errorMessages });
    }

    console.error('Error adding task:', error);
    res.status(500).json({ error: 'An error occurred while adding the task.' });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await db.Task.findAll();

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'An error occurred while getting the tasks.' });
  }
});

// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Delete the task with the specified id from the database
    await db.Task.destroy({
      where: { id: taskId },
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'An error occurred while deleting the task.' });
  }
});

// Mark a task as complete by ID
router.put('/:id/complete', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Update the task with the specified id and mark it as complete
    const updatedTask = await db.Task.update(
      { is_complete: true },
      {
        where: { id: taskId },
        returning: true,
      }
    );

    res.status(200).json(updatedTask[1][0]);
  } catch (error) {
    console.error('Error marking task as complete:', error);
    res.status(500).json({ error: 'An error occurred while marking the task as complete.' });
  }
});

// Clear completed tasks based on task_type
router.delete('/clear/:task_type', async (req, res) => {
  try {
    const taskType = req.params.task_type;

    // Clear completed tasks with the specified task_type
    await db.Task.destroy({
      where: {
        task_type: taskType,
        is_complete: true,
      },
    });

    res.status(200).json({ message: `Completed ${taskType} tasks cleared successfully` });
  } catch (error) {
    console.error('Error clearing completed tasks:', error);
    res.status(500).json({ error: 'An error occurred while clearing completed tasks.' });
  }
});

module.exports = router;
