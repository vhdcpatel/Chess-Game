const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbURL = process.env.DATABASE_URL;

const sequelize = new Sequelize(dbURL,{
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