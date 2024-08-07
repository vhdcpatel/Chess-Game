const Sequelize = require('sequelize');
const sequelize = require('./index');

const Users = sequelize.define('users',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstName:{
    type: Sequelize.STRING,
    allowNull:false,
  },
  lastName:{
    type: Sequelize.STRING,
    allowNull:false,
  },
  userName:{
    type: Sequelize.STRING,
    allowNull:false,
    unique: true,
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
})

module.exports = Users;