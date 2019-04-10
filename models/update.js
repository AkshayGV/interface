const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Update = sequelize.define('updates', {
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
    type: Sequelize.STRING(3),
    allowNull: false
  },
  expiry:{
    type: Sequelize.DATEONLY,
    allowNull: false
  }
});

module.exports = Update;
