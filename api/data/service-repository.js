const Sequelize = require('sequelize');
const Service = require('../models/service').Service;
const Frequency = require('../models/frequency').Frequency;
const Position = require('../models/position').Position;

const Op = Sequelize.Op;

class ServiceRepository {
  static getAll() {
    return Service.findAll({
      include:[{
        model: Frequency,
        as: 'frequency'
      },{
        model: Position
      }]
    });
  }
}

module.exports = {
  ServiceRepository
};