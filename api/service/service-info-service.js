const ServiceCalendarDateRepository = require('../data/service-calendar-date-repository')
  .ServiceCalendarDateRepository;

class ServiceInfoService {
  static async saveServiceInfo(serviceInfo) {
    let newServiceInfo = null;
    if (!serviceInfo.id) {
      newServiceInfo = await ServiceCalendarDateRepository.createServiceInfo(
        serviceInfo
      );
    } else {
      await ServiceCalendarDateRepository.updateServiceInfo(serviceInfo);
      newServiceInfo = serviceInfo;
    }

    return await ServiceCalendarDateRepository.getServiceInfoById(
      newServiceInfo.id
    );
  }
  static async getServiceInfoById(serviceInfoId) {
    return ServiceCalendarDateRepository.getServiceInfoById(serviceInfoId);
  }
}

module.exports = { ServiceInfoService };
