const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/database.json')[env];

module.exports.sequelizeClient = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host,
    logging: config.logging,
    dialectOptions: {
      multipleStatements: true
    }
  }
);
