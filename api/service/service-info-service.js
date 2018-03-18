const ServiceCalendarDateRepository = require('../data/service-calendar-date-repository')
  .ServiceCalendarDateRepository;

class ServiceInfoService {
  static async saveServiceInfo(serviceInfo) {
    return ServiceCalendarDateRepository.updateServiceInfo(serviceInfo);
  }
  static async getServiceInfoById(serviceInfoId) {
    return ServiceCalendarDateRepository.getServiceInfoById(serviceInfoId);
  }
}

module.exports = { ServiceInfoService };
