const ServicesService = require('../service/services-service');
const { addChangelog } = require('../service/changelogs-service');
const DtoMapper = require('../mapper/dto-mapper');
const log = require('../utilities/logger');
const pusher = require('../utilities/pusher');
const { ok } = require('../utilities/response-helper');

async function getServices(req, res, next) {
  try {
    const services = await ServicesService.getServices();
    const dto = DtoMapper.mapServicesToDto(services);

    res.json(ok(dto));
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

    res.json(ok(data));
  } catch (err) {
    next(err);
  }
}

async function saveService(req, res, next) {
  try {
    const incomingDto = { id: req.params.id, data: req.body };
    const service = await DtoMapper.mapServiceDtoToModel(incomingDto);
    const updatedService = await ServicesService.saveService(service);
    const data = DtoMapper.mapServiceToDto(updatedService);

    await addChangelog('service', req, data);
    pusher.trigger('index', 'service-modified', data);
    res.json(ok(data));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getServices,
  getServiceById,
  saveService
};
