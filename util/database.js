const Sequelize = require('sequelize');

const sequelize = new Sequelize('uniDb', 'akshay', '00000000', {
  dialect: 'mysql',
  host: 'chatbot.cbp38j61cec8.us-east-1.rds.amazonaws.com',
  logging: false
});

module.exports = sequelize;
