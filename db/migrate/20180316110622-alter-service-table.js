
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('services', [
      { id: 3, name: '主日學小班', locale: 'zh-TW', frequencyId: 2, footnoteLabel: '課程：耶穌花園（幼兒級）' },
      { id: 4, name: '主日學中班', locale: 'zh-TW', frequencyId: 2, footnoteLabel: '課程：耶穌花園（中小級）' },
      { id: 5, name: '主日學大班', locale: 'zh-TW', frequencyId: 2, footnoteLabel: '課程：耶穌花園（高小級）' },
      { id: 6, name: 'Prayer Meeting', locale: 'en-AU', frequencyId: 3, footnoteLabel: 'Topic' },
    ]);
  },

  down: () => {

  }
};
