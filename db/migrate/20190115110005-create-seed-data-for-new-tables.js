'use strict';
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await sequelizeClient.query(
      `INSERT INTO frequencies_v2 (name)
      SELECT name FROM frequencies;

      INSERT INTO services_v2 (name, locale, footnoteLabel, slug, frequencyId)
      SELECT name, locale, footnoteLabel, label, frequencyId FROM services;

      INSERT INTO positions_v2 (name, \`order\`, serviceId)
      SELECT name, \`order\`, serviceId FROM positions;

      INSERT INTO events_v2 (date, footnote, skipReason, skipService, serviceId)
      SELECT date, footnote, skipReason, skipService, serviceId FROM service_calendar_dates AS sd INNER JOIN calendar_dates as d ON sd.calendarDateId = d.id;

      CREATE TEMPORARY TABLE temp_event (
      select ev.volunteerName, pos.name AS posName, cd.date, svc.name AS serviceName
      from \`events\` AS ev INNER JOIN calendar_dates AS cd ON ev.calendarDateId = cd.id
      INNER JOIN positions AS pos ON ev.positionId = pos.id
      INNER JOIN services AS svc ON pos.serviceId = svc.id);

      INSERT INTO event_positions_v2 (name, eventId, positionId)
      SELECT DISTINCT te.volunteerName, ev2.id, pos2.id FROM temp_event AS te LEFT JOIN
      events_v2 AS ev2 ON te.date = ev2.date
      INNER JOIN services_v2 AS svc2 ON te.serviceName = svc2.name
      INNER JOIN positions_v2 AS pos2 ON te.posName = pos2.name;`
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
