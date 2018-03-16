const Sequelize = require('sequelize');
const Frequency = require('../models/frequency').Frequency;

const Op = Sequelize.Op;

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