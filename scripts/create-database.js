const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];

const sequelize = new Sequelize(undefined, config.username, config.password, {
  dialect: config.dialect,
  host: config.host
});

return sequelize
  .query(`CREATE DATABASE ${config.database}`)
  .catch(err => console.log(err))
  .lastly(() => sequelize.close());
