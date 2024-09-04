const Games = require("../models/models");
const getResponse = require("../utils/getResponse");

exports.startGame = async (req,res) => {
  try{
    const userId = req.user.user.userName;
    // one user is added by jwt 
    console.log(req.user.user.userName);
    
    const newGame = await Games.create({
      player1Id: userId,
      gameStatus: 'pending',
    });

    return res.status(201).json({
      success: true,
      gameCode: newGame.id,
      message: "Game created successfully. Share this code to invite others.",
    });

  } catch(error){
      return res.status(500).json({
        success: false,
        message: "Failed to create game.",
        error: error.message,
      });
  }
}