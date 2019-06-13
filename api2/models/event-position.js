module.exports = (Sequelize, sequelizeClient) => {
  const EventPosition = sequelizeClient.define(
    'event_position',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true,
      tableName: 'event_positions_v2'
    }
  );

  return EventPosition;
};
