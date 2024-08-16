const sequelize = require('./index');

const syncDatabase = async () => {
  try {
    await sequelize.sync({
      force:true
    });
    console.log('Database synchronized successfully.');
  } catch (err) {
    console.error('Error synchronizing the database:', err);
  }
};

module.exports = syncDatabase;