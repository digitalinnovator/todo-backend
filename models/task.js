// ./models/task.js

module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_name: {
        type: Sequelize.STRING,
        allowNull: false, // Task name is required
        validate: {
          notEmpty: { msg: 'Task name cannot be empty.' },
        },
      },
      task_type: {
        type: Sequelize.ENUM('personal', 'professional'),
        allowNull: false, // Task type is required
        validate: {
          isValidTaskType(value) {
            if (value !== 'personal' && value !== 'professional') {
              throw new Error('Invalid task type. Only "personal" or "professional" are allowed.');
            }
          },
        },
      },
      is_complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  
    return Task;
  };
  