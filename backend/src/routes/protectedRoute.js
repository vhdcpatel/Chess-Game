const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/protected', authenticateToken, (req, res) => {
  res.status(401).json({ message: 'UnAuthorized' });
});

module.exports = router;