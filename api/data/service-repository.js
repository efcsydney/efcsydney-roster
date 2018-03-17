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
    return Service.create(service).then(result => result);
  }

  static updateService(service){
    return Service.update(service,
      {
        where: { id: service.id }
      }
    ).then(() => service);
  }
}

module.exports = {
  ServiceRepository
};