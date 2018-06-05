const Sequelize = require('sequelize');
const CalendarDate = require('../models/calendar-date').CalendarDate;

const Op = Sequelize.Op;

class CalendarDateRepository {
  static create(date) {
    return CalendarDate.create({ date: date });
  }
  static getDatesByDateRange(dateRange) {
    const { from, to } = dateRange;
    return CalendarDate.findAll({
      where: { date: { [Op.gte]: from, [Op.lte]: to } }
    });
  }
  static async getByDate(date) {
    return await CalendarDate.findOne({
      where: { date: { [Op.eq]: date } }
    });
  }
}

module.exports = {
  CalendarDateRepository
};
