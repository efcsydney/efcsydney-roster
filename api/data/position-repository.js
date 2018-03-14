const Sequelize = require('sequelize');
const Position = require('../models/position').Position;

const Op = Sequelize.Op;

class PositionRepository {
  static getAll() {
    return Position.findAll({
      order: [['id', 'ASC']]
    });
  }

  static createPosition(position){
    return Position.create(position);
  }

  static updatePosition(position){
    return Position.update({
      name: position.name,
      order: position.order,
    },
    {
      where: { id: position.id }
    })
  }

  static bulkCreatePositions(positions){
    return Position.bulkCreate(positions, { updateOnDuplicate: true });
  }
}

module.exports = {
  PositionRepository
};
