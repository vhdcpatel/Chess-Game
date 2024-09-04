const express = require("express");
const { startGame } = require("../controllers/gameController");
const authenticateToken = require("../middlewares/authentication");

const router = express.Router();

router.use(authenticateToken);

router.get('/start',startGame);

module.exports = router;