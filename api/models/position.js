const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client');
const events = require('./event');

const positions = sequelizeClient.define('positions', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    }
},{
    timestamps: false
  }) 

module.exports = positions;