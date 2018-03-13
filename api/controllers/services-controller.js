const ServicesService = require('../service/services-service').ServicesService;
const DtoMapper = require('../mapper/dto-mapper').DtoMapper;
const log = require('../utilities/logger');

/**
 * Get Services
 */
async function getServices(req, res, next) {
  try {
    const services = await ServicesService.getServices();
    const dto = DtoMapper.mapServiceToDto(services);

    res.json({
      result: 'OK',
      error: { message: '' },
      data: dto
    });
  } catch (err) {
    next(err);
  }
}



module.exports = {
  getServices,
};
