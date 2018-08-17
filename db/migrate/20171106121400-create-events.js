module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'events',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        volunteerName: {
          type: Sequelize.STRING,
          defaultValue: ''
        },
        calendarDateId: {
          type: Sequelize.INTEGER
        },
        positionId: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      },
      {
        charset: 'utf8',
        uniqueKeys: [
          {
            name: 'unique on calendar date and position',
            singleField: false,
            fields: ['calendarDateId', 'positionId']
          }
        ]
      }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable('events');
  }
};
