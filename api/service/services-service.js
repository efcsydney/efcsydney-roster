const log = require('../utilities/logger');
const getDateString = require('../utilities/datetime-util').getDateString;
const ServiceRepository = require('../data/service-repository').ServiceRepository;
const PositionRepository = require('../data/position-repository').PositionRepository;

class ServicesService {
  static async getServices() {
    const services = await ServiceRepository.getAll();
    return services;
  }

  static async getServiceById(id) {
    const service = await ServiceRepository.getServiceById(id);
    return service;
  }

  static async saveService(service) {
    let updatedService;
    if (!service.id || service.id < 1) {
      updatedService = await ServiceRepository.createService(service);
    } else {
      updatedService = await ServiceRepository.updateService(service);
    }
    const serviceId = updatedService.id;
    const positions = service.positions.map(position => { position.serviceId = serviceId; return position; });

    await PositionRepository.bulkCreateOrUpdatePositions(positions);

    return await ServicesService.getServiceById(serviceId);
  }
}

module.exports = { ServicesService };
