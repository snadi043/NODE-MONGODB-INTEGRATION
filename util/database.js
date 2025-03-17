const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-development', 'root', 'swathiKumar@18', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
