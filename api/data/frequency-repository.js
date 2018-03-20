const Frequency = require('../models/frequency').Frequency;

class FrequencyRepository {
  static getFrequencyByName(name) {
    return Frequency.findOne({
      where: { name: name }
    });
  }
}

module.exports = {
  FrequencyRepository
};