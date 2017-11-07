const Sequelize = require('sequlelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/database.json')[env];

export const sequelizeClient = new Sequelize(config.database, config.username, null, {
  dialect: config.dialect,
  host: config.host
});
