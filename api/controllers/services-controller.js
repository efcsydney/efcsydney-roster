const ServicesService = require('../service/services-service').ServicesService;
const DtoMapper = require('../mapper/dto-mapper').DtoMapper;

/**
 * Get Services
 */
async function getServices(req, res, next) {
  try {
    const services = await ServicesService.getServices();
    const dto = DtoMapper.mapServicesToDto(services);

    res.json({
      result: 'OK',
      error: { message: '' },
      data: dto
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Services
 */
async function saveService(req, res, next) {
  try {
    const incomingDto = {id: req.params.id, data: req.body};
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
  saveService
};
