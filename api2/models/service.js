module.exports = (Sequelize, sequelizeClient) => {
  const Service = sequelizeClient.define(
    'service',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      locale: {
        type: Sequelize.STRING
      },
      footnoteLabel: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true,
      tableName: 'services_v2'
    }
  );

  return Service;
};
