const { Sequelize } = require('sequelize');

// Connects to XAMPP MySQL. 'root' is default user, empty string is default password.
const sequelize = new Sequelize('vd_foundation_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to XAMPP MySQL Database successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

connectDB();

module.exports = sequelize;