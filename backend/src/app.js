const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const sequelize = require('./models/index');
const users = require('./models/users');
const authRoutes = require('./routes/auth');

require('dotenv').config();

// local imports.
const dummyRoutes = require('./routes/dummyRoutes');
const corsOptions = require('./config/corsOptions');

// Initialize the app
const app = express();


// Enable CORS with options
app.use(cors(corsOptions));
app.use(cookieParser())

// Middleware for parsing request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes)

app.use('/api', dummyRoutes);


// Database connection
sequelize.sync({
    // force: true,
})
  .then((res) => {
    console.log('Database synchronized successfully.',res);
    //
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err);
  });

// Error handling middleware (example)
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'An error occurred' });
});

module.exports = app;
