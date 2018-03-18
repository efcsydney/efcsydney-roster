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
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
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

  down: (queryInterface) => {
    return queryInterface.dropTable('events');
  }
};
