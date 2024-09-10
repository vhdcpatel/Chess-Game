const express = require("express");
const { startGame, joinGame } = require("../controllers/gameController");
const authenticateToken = require("../middlewares/authentication");

const router = express.Router();

router.use(authenticateToken);

router.post('/start',startGame);

router.post('/join', joinGame)

module.exports = router;