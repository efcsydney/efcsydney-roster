const Sequelize = require('sequelize');
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

const db = {};

db.Sequelize = Sequelize;
db.SequelizeClient = sequelizeClient;

db.events = require('./event')(Sequelize, sequelizeClient);
db.services = require('./service')(Sequelize, sequelizeClient);
db.positions = require('./position')(Sequelize, sequelizeClient);
db.eventPositions = require('./event-position')(Sequelize, sequelizeClient);
db.frequencies = require('./frequency')(Sequelize, sequelizeClient);

db.services.hasMany(db.positions, { foreignKey: 'serviceId' });
db.positions.belongsTo(db.services);
db.services.hasMany(db.events, { foreignKey: 'serviceId' });
db.events.belongsTo(db.services);
db.frequencies.hasMany(db.services, { foreignKey: 'frequencyId' });
db.services.belongsTo(db.frequencies);
db.positions.belongsToMany(db.events, {
  through: db.eventPositions
});
db.events.belongsToMany(db.positions, {
  through: db.eventPositions
});

module.exports = db;
