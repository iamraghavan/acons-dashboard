const express = require('express');
const serverless = require('serverless-http');
const app = express();

// Your existing middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', require('../routes/authRoutes'));

// Export the serverless function
module.exports.handler = serverless(app);