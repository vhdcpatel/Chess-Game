const { Games, Users } = require("../models/models");

exports.startGame = async (req,res) => {
  try{    
    const userName = req.user.userName;
    const userInfo = await Users.findOne({where: {userName: userName}});

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if user already has a game
    const existingGame = await Games.findOne({
      where: {
        player1Id: userInfo.id,
        gameStatus: 'pending'
      }
    });

    if (existingGame) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending game. Please wait for the other player to join.",
      });
    }
    
    const newGame = await Games.create({
      player1Id: userInfo.id,
      gameStatus: 'pending',
    });

    return res.status(201).json({
      success: true,
      gameCode: newGame.id,
      message: "Game created successfully. Share this code to invite others.",
    });

  } catch(error){
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create game.",
        error: error.message,
      });
  }
}

exports.joinGame = async (req,res) => {
  try{
    const { gameCode } = req.body;
    const userName = req.user.userName;
    
    const userInfo = await Users.findOne({where: {userName: userName}});
    
    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const gameInfo = await Games.findOne({where: {id: gameCode}});
    if (!gameInfo) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    if (gameInfo.gameStatus === 'started') {
      return res.status(400).json({
        success: false,
        message: "Game has already started",
      });
    }

    if (gameInfo.player1Id === userInfo.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot join your own game",
      });
    }

    if (gameInfo.player2Id) {
      return res.status(400).json({
        success: false,
        message: "Game is already full",
      });
    }

    gameInfo.player2Id = userInfo.id;
    gameInfo.gameStatus = 'started';
    await gameInfo.save();

  } catch(error){
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to join game.",
        error: error.message,
      });
  }

}