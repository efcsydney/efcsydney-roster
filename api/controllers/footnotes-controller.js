const DtoMapper = require('../mapper/dto-mapper').DtoMapper;
const ServiceInfoService = require('../service/service-info-service').ServiceInfoService;
const log = require('../utilities/logger');

async function saveFootnote(req, res, next) {
  try {
    const footnote = DtoMapper.convertDtoToFootnoteModel({id: req.params.id, data: req.body});
    log.info(footnote);
    await ServiceInfoService.saveFootnote(footnote);

    const response = {
      result: 'OK',
      error: { message: '' }
    };

    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  saveFootnote
};
