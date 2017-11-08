const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client').sequelizeClient;
const events = require('./event').events;

const positions = sequelizeClient.define('positions', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    }
},{
    timestamps: false
  }) 

  export const positions;