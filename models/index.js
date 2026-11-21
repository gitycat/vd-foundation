const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('vd_foundation_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'Volunteer' }
});

const Village = sequelize.define('Village', {
  name: { type: DataTypes.STRING, allowNull: false },
  district: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  pinCode: { type: DataTypes.STRING }
});

// IMPORT THE NEW COMPREHENSIVE SURVEY MODEL INSTEAD OF HARDCODING IT
const Survey = require('./Survey')(sequelize, DataTypes);

// Keep your existing table associations
User.hasMany(Survey, { foreignKey: 'volunteerId' });
Survey.belongsTo(User, { foreignKey: 'volunteerId' });

Village.hasMany(Survey, { foreignKey: 'villageId' });
Survey.belongsTo(Village, { foreignKey: 'villageId' });

// Sync database changes
sequelize.sync({ alter: true });

module.exports = { sequelize, User, Village, Survey };