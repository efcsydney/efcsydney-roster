const log = require('../utilities/logger');
const getDateString = require('../utilities/datetime-util').getDateString;
const ServiceRepository = require('../data/service-repository').ServiceRepository;

class ServicesService {
  static async getServices() {
    const services = await ServiceRepository.getAll();
    return services;
  }
}

module.exports = { ServicesService };
