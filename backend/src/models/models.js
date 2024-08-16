const sequelize = require('./index');

const Users = require('./users');
const Games = require('./games');

// Define associations
Users.hasMany(Games, { foreignKey: 'player1Id' });
Users.hasMany(Games, { foreignKey: 'player2Id' });
Games.belongsTo(Users, { as: 'player1', foreignKey: 'player1Id' });
Games.belongsTo(Users, { as: 'player2', foreignKey: 'player2Id' });

// Export models
module.exports = {
  Users,
  Games,
  sequelize,
};