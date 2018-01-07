const DtoMapper = require('../mapper/dto-mapper').DtoMapper;
const FootnoteService = require('../service/footnote-service').FootnoteService;

async function saveFootnote(req, res) {
  try {

    const footnote = DtoMapper.convertDtoToFootnoteModel({id: req.params.id, data: req.body});
    await FootnoteService.saveFootnote(footnote);

    const response = {
      result: 'OK',
      error: { message: '' }
    };

    return res.status(201).json(response);
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      result: 'error',
      error: { message: err.message }
    });
  }
}

module.exports = {
  saveFootnote
};
