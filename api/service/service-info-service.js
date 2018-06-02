const ServiceCalendarDateRepository = require('../data/service-calendar-date-repository')
  .ServiceCalendarDateRepository;

class ServiceInfoService {
  static async saveServiceInfo(serviceInfo) {
    if (!serviceInfo.id) {
      return ServiceCalendarDateRepository.createServiceInfo(serviceInfo);
    } else {
      await ServiceCalendarDateRepository.updateServiceInfo(serviceInfo);
      return serviceInfo;
    }
  }
  static async getServiceInfoById(serviceInfoId) {
    return ServiceCalendarDateRepository.getServiceInfoById(serviceInfoId);
  }
}

module.exports = { ServiceInfoService };
