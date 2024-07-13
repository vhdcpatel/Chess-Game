const Sequelize = require('sequelize');
const sequelize = require('./index');

const users = sequelize.define('users',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name:{
    type: Sequelize.STRING,
    allowNull:false,
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
})

module.exports = users;