// const Sequelize = require('sequelize');
// const sequelizeClient = require('../../api/infrastructure/sequelize-client')
//   .sequelizeClient;
module.exports = (Sequelize, sequelizeClient) => {
  const Event = sequelizeClient.define(
    'event',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: Sequelize.DATEONLY
      },
      footnote: {
        type: Sequelize.STRING
      },
      skipReason: {
        type: Sequelize.STRING
      },
      skipService: {
        type: Sequelize.BOOLEAN
      },
      serviceId: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true,
      tableName: 'events_v2'
    }
  );
  return Event;
};
