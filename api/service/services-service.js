const { getServices, getServiceById, createService, updateService } = require('../data/service-repository').ServiceRepository;
const { bulkCreateOrUpdatePositions } = require('../data/position-repository').PositionRepository;

class ServicesService {
  static async getServices() {
    const services = await getServices();
    return services;
  }

  static async getServiceById(id) {
    const service = await getServiceById(id);
    return service;
  }

  static async saveService(service) {
    let updatedService;
    if (!service.id) {
      updatedService = await createService(service);
    } else {
      updatedService = await updateService(service);
    }
    const serviceId = updatedService.id;
    const positions = service.positions.map(position => ({ serviceId, ...position }));

    await bulkCreateOrUpdatePositions(positions);

    return await getServiceById(serviceId);
  }
}

module.exports = ServicesService;
