class MockRepository {
  static getEventsByDateRange(dateRange, service) {
    return Promise.resolve([
      {
        date: '2017-10-08',
        positions: [
          { position: 'Speaker', name: 'Mock' },
          { position: 'Moderator', name: 'Angela Sun' },
          { position: 'P&W', name: 'Edison Huang' },
          { position: 'Pianist', name: 'Joseph Wang' },
          { position: 'Usher/Offering', name: 'Cheer Lin' },
          { position: 'PA/PPT', name: 'Raymond Tsang' },
          { position: 'Newsletter', name: 'Kai Chang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-10-15',
        positions: [
          { position: 'Speaker', name: 'Rev. Kian Holik' },
          { position: 'Moderator', name: 'Jennifer Chu' },
          { position: 'P&W', name: 'Amy Chen' },
          { position: 'Pianist', name: 'Yvonne Lu' },
          { position: 'Usher/Offering', name: 'Christine Yang' },
          { position: 'PA/PPT', name: 'Raymond Tsang' },
          { position: 'Newsletter', name: 'Kai Chang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-10-29',
        positions: [
          { position: 'Speaker', name: 'Rev. Kian Holic' },
          { position: 'Moderator', name: 'Bobby Lu' },
          { position: 'P&W', name: 'Robin Zhang' },
          { position: 'Pianist', name: 'Angela Sun' },
          { position: 'Usher/Offering', name: 'Kai Chang' },
          { position: 'PA/PPT', name: 'Raymond Tsang' },
          { position: 'Newsletter', name: 'Joseph Chiang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-11-5',
        positions: [
          { position: 'Speaker', name: 'Rev. Kian Holik' },
          { position: 'Moderator', name: 'Gary Tan' },
          { position: 'P&W', name: 'Jenny Hsu' },
          { position: 'Pianist', name: 'Amy Chen' },
          { position: 'Usher/Offering', name: 'Cheer Lin' },
          { position: 'PA/PPT', name: 'Raymond Tsang' },
          { position: 'Newsletter', name: 'Kai Chang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-11-12',
        positions: [
          { position: 'Speaker', name: 'Aaron Goh' },
          { position: 'Moderator', name: 'Jennifer Chu' },
          { position: 'P&W', name: 'Amy Chen' },
          { position: 'Pianist', name: 'Brian Chen' },
          { position: 'Usher/Offering', name: 'Christine Yang' },
          { position: 'PA/PPT', name: 'Raymond Tsang' },
          { position: 'Newsletter', name: 'Joseph Chiang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-11-19',
        positions: [
          { position: 'Speaker', name: 'Kathleen Kao' },
          { position: 'Moderator', name: 'Angela Sun' },
          { position: 'P&W', name: 'Yvonne Lu' },
          { position: 'Pianist', name: 'Amy Chen' },
          { position: 'Usher/Offering', name: 'Cheer Lin' },
          { position: 'PA/PPT', name: 'Raymond Tsang' },
          { position: 'Newsletter', name: 'Kai Chang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-11-26',
        positions: [
          { position: 'Speaker', name: 'David Luis' },
          { position: 'Moderator', name: 'Gary Tan' },
          { position: 'P&W', name: 'Dan Kao' },
          { position: 'Pianist', name: 'Yvonne Lu' },
          { position: 'Usher/Offering', name: 'Kai Chang' },
          { position: 'PA/PPT', name: 'Raymond Tsang & Jenny Shao' },
          { position: 'Newsletter', name: 'Joseph Chiang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-12-3',
        positions: [
          { position: 'Speaker', name: '' },
          { position: 'Moderator', name: 'Bobby Lu' },
          { position: 'P&W', name: 'Yvonne Lu' },
          { position: 'Pianist', name: 'Angela Sun' },
          { position: 'Usher/Offering', name: 'Christine Yang' },
          { position: 'PA/PPT', name: 'Raymond Tsang' },
          { position: 'Newsletter', name: 'Kai Chang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-12-10',
        positions: [
          { position: 'Speaker', name: 'Gary Tan' },
          { position: 'Moderator', name: 'Dan Kao' },
          { position: 'P&W', name: 'Betty Chen' },
          { position: 'Pianist', name: 'Amy Chen' },
          { position: 'Usher/Offering', name: 'Cheer Lin' },
          { position: 'PA/PPT', name: 'Raymond Tsang' },
          { position: 'Newsletter', name: 'Kai Chang' },
          { position: 'Refreshments', name: 'Christine Yang' }
        ]
      }
    ]);
  }
}

module.exports = {
  MockRepository
};
