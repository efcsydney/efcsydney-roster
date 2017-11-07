const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client').sequelizeClient;

export const events = sequelizeClient.define('events', {
  id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  }
}, {});