const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client').sequelizeClient;
const events = require('./event').events;

const calendars = sequelizeClient.define('calendars', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: Sequelize.DATE,
        unique: true,
    }
},{
    timestamps: false
  });

  export const calendars;