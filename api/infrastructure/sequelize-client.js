const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/database.json')[env];

const sequelizeClient = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
  host: config.host
});

export const sequelizeClient;