const ServiceCalendarDateRepository = require('../data/service-calendar-date-repository')
  .ServiceCalendarDateRepository;

class ServiceInfoService {
  static async saveServiceInfo(serviceInfo) {
    if (!serviceInfo.id) {
      return ServiceCalendarDateRepository.createServiceInfo(serviceInfo);
    } else {
      return ServiceCalendarDateRepository.updateServiceInfo(serviceInfo);
    }
  }
  static async getServiceInfoById(serviceInfoId) {
    return ServiceCalendarDateRepository.getServiceInfoById(serviceInfoId);
  }
}

module.exports = { ServiceInfoService };
