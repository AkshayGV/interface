const mysql = require('mysql2');

const pool = mysql.createPool({
  host:'chatbot.cbp38j61cec8.us-east-1.rds.amazonaws.com',
  user:'akshay',
  password:'00000000',
  database:'uniDb'
});

module.exports = pool.promise();