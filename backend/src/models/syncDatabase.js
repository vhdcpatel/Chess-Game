const {Games,Users} = require('./models');
const sequelize = require('./index');

const syncDatabase = async (withDrop=false) => {
  try {
    if(withDrop){
      // await sequelize.drop();
      await Games.drop();
      await Users.drop(); 
      // Sync all models and create tables
      // await sequelize.sync();
  
      console.log('Database has been reset');
      // return;
    }

    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (err) {
    console.error('Error synchronizing or Reseting DB the database:', err);
  }
};

module.exports = syncDatabase;