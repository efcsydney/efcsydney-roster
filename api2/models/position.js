module.exports = (Sequelize, sequelizeClient) => {
  const Position = sequelizeClient.define(
    'position',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      serviceId: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true,
      tableName: 'positions_v2'
    }
  );

  return Position;
};
