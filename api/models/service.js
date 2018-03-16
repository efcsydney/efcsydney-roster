const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const Frequency = require('./frequency').Frequency;

const Service = sequelizeClient.define('services', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  locale: {
    type: Sequelize.STRING
  },
  frequencyId: {
    type: Sequelize.INTEGER
  },
  footnoteLabel: {
    type: Sequelize.STRING
  },
  label: {
    type: Sequelize.STRING
  }
});

Service.Frequency = Service.belongsTo(Frequency, {
  as: 'frequency',
  foreignKey: 'frequencyId'
});
Frequency.hasMany(Service, { foreignKey: 'frequencyId' });

module.exports = {
  Service
};
