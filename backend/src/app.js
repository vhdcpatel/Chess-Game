const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// local imports.
const dummyRoutes = require('./routes/dummyRoutes');
const corsOptions = require('./config/corsOptions');

// Initialize the app
const app = express();


// Enable CORS with options
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', dummyRoutes);

// Error handling middleware (example)
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'An error occurred' });
});

module.exports = app;