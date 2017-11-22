const Sequelize = require('sequelize');
const Position = require('../models/position').Position;

const Op = Sequelize.Op;

class PositionRepository {
  static getAll() {
    return Position.findAll({
      order: [['name', 'ASC']]
    });
  }
}

module.exports = {
  PositionRepository
};
