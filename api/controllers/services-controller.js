const ServicesService = require('../service/services-service');
const DtoMapper = require('../mapper/dto-mapper');
const log = require('../utilities/logger');

async function getServices(req, res, next) {
  try {
    log.info('getServices');
    const services = await ServicesService.getServices();
    const dto = DtoMapper.mapServicesToDto(services);

    res.json({
      result: 'OK',
      error: { message: '' },
      data: dto
    });
  } catch (err) {
    log.error(err);
    next(err);
  }
}

async function getServiceById(req, res, next) {
  try {
    log.info('getServiceById  ', req.params.id);
    const id = req.params.id;
    const data = await ServicesService.getServiceById(id);

    res.json({
      result: 'OK',
      error: { message: '' },
      data
    });
  } catch (err) {
    next(err);
  }
}

async function saveService(req, res, next) {
  try {
    const incomingDto = { id: req.params.id, data: req.body };
    const service = await DtoMapper.mapServiceDtoToModel(incomingDto);
    const updatedService = await ServicesService.saveService(service);
    const outgoingDto = DtoMapper.mapServiceToDto(updatedService);

    res.json({
      result: 'OK',
      error: { message: '' },
      data: outgoingDto
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getServices,
  getServiceById,
  saveService
};
