const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client');
const events = require('./event');

const calendars = sequelizeClient.define('calendars', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    date: {
        type: Sequelize.DATE,
        unique: true,
    }
},{
    timestamps: false
  });

module.exports = calendars;