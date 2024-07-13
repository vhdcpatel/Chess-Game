const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, process.env.DATABASE_PATH);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
})  

module.exports = sequelize;