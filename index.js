const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());

// Importing and usage of routes
const tasksRouter = require('./src/routes/tasks');
app.use('/tasks', tasksRouter);


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
