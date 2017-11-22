const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../app').app;

describe('Server', function() {
  describe('get events', function() {
    it('returns 4 weeks of data between 2017-03-01 and 2017-03-27', function() {
      return request(app)
        .get('/api/events?from=2017-03-01&to=2017-03-27&mock=false')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.data.length).to.equal(4);
        });
    });

    it('returns the 3 weeks of data between 2017-10-01 and 2017-10-15', function() {
      return request(app)
        .get('/api/events?from=2017-10-01&to=2017-10-15&mock=false')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.data).to.eql([
            {
              date: '2017-10-15',
              members: [
                { role: 'Moderator', name: '' },
                { role: 'Newsletter', name: '' },
                { role: 'P&W', name: '' },
                { role: 'PA/PPT', name: '' },
                { role: 'Pianist', name: '' },
                { role: 'Refreshments', name: '' },
                { role: 'Speaker', name: '' },
                { role: 'Usher/Offering', name: '' },
              ]
            },
            {
              date: '2017-10-08',
              members: [
                { role: 'Moderator', name: 'Angela Sun' },
                { role: 'Newsletter', name: 'Kai Chang' },
                { role: 'P&W', name: 'Edison Huang' },
                { role: 'PA/PPT', name: 'Raymond Tsang' },
                { role: 'Pianist', name: 'Joseph Wang' },
                { role: 'Refreshments', name: 'Christine Yang' },
                { role: 'Speaker', name: 'May Chien' },
                { role: 'Usher/Offering', name: 'Cheer Lin' },
              ]
            },
            {
              date: '2017-10-01',
              members: [
                { role: 'Moderator', name: '' },
                { role: 'Newsletter', name: '' },
                { role: 'P&W', name: '' },
                { role: 'PA/PPT', name: '' },
                { role: 'Pianist', name: '' },
                { role: 'Refreshments', name: '' },
                { role: 'Speaker', name: '' },
                { role: "Usher/Offering", name: '' },
              ]
            }
          ]);
        });
    });

    it('returns 12 weeks of date by default when the end date is not specified', function() {
      return request(app)
        .get('/api/events?from=2017-09-02&mock=false')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.data.length).to.eql(12);
        });
    });

    it('returns 12 week of date by default when the start date and end date are not specified', function() {
      return request(app)
        .get('/api/events?mock=false')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.data.length).to.equal(12);
        });
    });
  });
});