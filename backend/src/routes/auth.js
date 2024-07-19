const express = require('express');
const { signUpUser, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup',signUpUser);
router.post('/login',login);

router.get('/dummy', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

module.exports = router;