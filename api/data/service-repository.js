const Service = require('../models/service').Service;
const Frequency = require('../models/frequency').Frequency;
const Position = require('../models/position').Position;

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
      label: service.label,
      frequencyId: service.frequencyId,
    }).then(result => result);
  }

  static updateService(service){
    return Service.update(
      {
        name: service.name,
        footnoteLabel: service.footnoteLabel,
        frequencyId: service.frequencyId,
        label: service.label,
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