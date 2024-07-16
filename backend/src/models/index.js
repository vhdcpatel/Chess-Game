const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const user = process.env.DBUSERNAME;
const passWord = process.env.PASSWORD;

console.log(user,passWord);
const sequelize = new Sequelize('chess_project',user,passWord,{
    host: 'localhost',
    dialect: 'mysql',
})  

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;