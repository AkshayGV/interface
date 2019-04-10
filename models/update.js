const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Update = sequelize.define('latest_updates', 
{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  level:{
    type: Sequelize.ENUM,
    values: ['UNI', 'CSE', 'ECE','EEE','ME','CE'],
    allowNull: false
  },
  expiry:{
    type: Sequelize.DATEONLY,
    allowNull: false
  }
});

module.exports = Update;
