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

  static getServiceById(id){
    return Service.findOne({
      where: {id: id},
      include:[{
        model: Frequency,
        as: 'frequency'
      },{
        model: Position
      }]
    })
  }

  static createService(service) {
    return Service.create({
      name: service.name,
      footnoteLabel: service.footnoteLabel,
      frequencyId: service.frequencyId,
    }).then(result => result);
  }

  static updateService(service){
    return Service.update(
      {
        name: service.name,
        footnoteLabel: service.footnoteLabel,
        frequencyId: service.frequencyId,
      },
      {
        where: { id: service.id }
      }
    ).then(() => service);
  }
}

module.exports = {
  ServiceRepository
};