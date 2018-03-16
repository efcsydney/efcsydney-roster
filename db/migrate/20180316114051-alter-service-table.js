const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const services = [
      { id: 1, name: 'english', locale: 'en-AU', label: '英文堂 English Service', frequencyId: 1, footnoteLabel: 'Occassion'  },
      { id: 2, name: 'chinese', locale: 'zh-TW', label: '中文堂 Chinese Service', frequencyId: 1, footnoteLabel: '型式'  },
      { id: 3, name: 'preschool-junior', locale: 'zh-TW', label: '主日學小班', frequencyId: 2, footnoteLabel: '課程：耶穌花園（幼兒級）' },
      { id: 4, name: 'preschool-middle', locale: 'zh-TW', label: '主日學中班', frequencyId: 2, footnoteLabel: '課程：耶穌花園（中小級）' },
      { id: 5, name: 'preschool-senior', locale: 'zh-TW', label: '主日學大班', frequencyId: 2, footnoteLabel: '課程：耶穌花園（高小級）' },
      { id: 6, name: 'prayer', locale: 'en-AU', label: 'Prayer Meeting', frequencyId: 3, footnoteLabel: 'Topic' },
    ];

    await queryInterface.addColumn(
      'services',
      'label',
      Sequelize.STRING,
      {
        after: 'footnoteLabel'
      },
      {
        charset: 'utf8'
      }
    );

    await Promise.all(services.map(service => {
      return sequelizeClient.query(
        `UPDATE services
          SET
            name = '${service.name}',
            label = '${service.label}',
            footnoteLabel = '${service.footnoteLabel}'
         WHERE
            id = ${service.id}`
      )
    }));
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
