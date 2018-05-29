const DtoMapper = require('../mapper/dto-mapper');
const ServiceInfoService = require('../service/service-info-service')
  .ServiceInfoService;
const log = require('../utilities/logger');
const pusher = require('../utilities/pusher');

async function saveServiceInfo(req, res, next) {
  try {
    const serviceInfo = DtoMapper.convertDtoToServiceInfoModel({
      id: req.params.id,
      data: req.body
    });
    log.info(serviceInfo);
    const updatedServiceInfo = await ServiceInfoService.saveServiceInfo(
      serviceInfo
    );

    const data = DtoMapper.mapServiceInfoToDto(updatedServiceInfo);

    const response = {
      result: 'OK',
      error: { message: '' },
      data
    };

    pusher.trigger('index', 'serviceInfo-modified', data);

    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

async function createServiceInfo(req, res, next) {
  try {
    const serviceInfo = DtoMapper.convertDtoToServiceInfoModel({
      id: 0,
      data: req.body
    });
    log.info(serviceInfo);
    const newServiceInfo = await ServiceInfoService.saveServiceInfo(
      serviceInfo
    );

    const updatedServiceInfo = await ServiceInfoService.getServiceInfoById(
      newServiceInfo.get('id')
    );
    log.info(updatedServiceInfo);
    const data = DtoMapper.mapServiceInfoToDto(updatedServiceInfo);

    const response = {
      result: 'OK',
      error: { message: '' },
      data
    };

    pusher.trigger('index', 'serviceInfo-modified', data);

    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  saveServiceInfo,
  createServiceInfo
};
