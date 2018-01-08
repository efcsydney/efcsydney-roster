const moment = require('moment');
const FootnoteRepository = require('../data/footnote-repository')
  .FootnoteRepository;
const log = require('winston');
const getDateString = require('../utilities/datetime-util').getDateString;

class FootnoteService {
  static async saveFootnote(footnote) {

    return FootnoteRepository.updateFootnote(footnote);
  }
}

module.exports = { FootnoteService };