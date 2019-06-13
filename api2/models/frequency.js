module.exports = (Sequelize, sequelizeClient) => {
  const Frequency = sequelizeClient.define(
    'frequency',
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
      tableName: 'frequencies_v2'
    }
  );

  return Frequency;
};
