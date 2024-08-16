const Sequelize = require('sequelize');
const sequelize = require('./index');

const Games = sequelize.define('games',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull:false,
    primaryKey: true,
  },
  player1Id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  player2Id:{
    type: Sequelize.INTEGER,
    allowNull:true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  gameStatus:{
    type: Sequelize.STRING,
  },
  winner:{
    type: Sequelize.STRING,
  }
})

module.exports = Games;