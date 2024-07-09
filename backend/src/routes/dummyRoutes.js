const express = require('express');
const router = express.Router();

// Dummy endpoint
router.get('/dummy', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

module.exports = router;
