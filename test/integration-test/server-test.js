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

    it('returns 3 weeks of data between 2017-10-01 and 2017-10-15', function() {
      return request(app)
        .get('/api/events?from=2017-10-01&to=2017-10-15&mock=false')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.data).to.eql([
            {
              date: '2017-10-15',
              members: [
                { role: 'Speaker', name: '' },
                { role: 'Moderator', name: '' },
                { role: 'P&W', name: '' },
                { role: 'Pianist', name: '' },
                { role: 'Usher/Offering', name: '' },
                { role: 'PA/PPT', name: '' },
                { role: 'Newsletter', name: '' },
                { role: 'Refreshments', name: '' }
              ]
            },
            {
              date: '2017-10-08',
              members: [
                { role: 'Speaker', name: 'May Chien' },
                { role: 'Moderator', name: 'Angela Sun' },
                { role: 'P&W', name: 'Edison Huang' },
                { role: 'Pianist', name: 'Joseph Wang' },
                { role: 'Usher/Offering', name: 'Cheer Lin' },
                { role: 'PA/PPT', name: 'Raymond Tsang' },
                { role: 'Newsletter', name: 'Kai Chang' },
                { role: 'Refreshments', name: 'Christine Yang' }
              ]
            },
            {
              date: '2017-10-01',
              members: [
                { role: 'Speaker', name: '' },
                { role: 'Moderator', name: '' },
                { role: 'P&W', name: '' },
                { role: 'Pianist', name: '' },
                { role: 'Usher/Offering', name: '' },
                { role: 'PA/PPT', name: '' },
                { role: 'Newsletter', name: '' },
                { role: 'Refreshments', name: '' }
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

    it('updates an event where its time contains timezone info', function() {
      const event = {
        date: '2017-11-04T13:00:00.000Z',
        role: 'Usher/Offering',
        name: 'Christine Yang'
      };
      return request(app)
        .put('/api/events')
        .send(event)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res) {
          expect(res.body.result).to.equal('OK');
        });
    });

    it('updates an event where its time excludes timezone', function() {
      const event = {
        date: '2017-11-05T13:00:00',
        role: 'Usher/Offering',
        name: 'Christine Yang'
      };
      return request(app)
        .put('/api/events')
        .send(event)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res) {
          expect(res.body.result).to.equal('OK');
        });
    });

    it('updates an event where its time contains date only', function() {
      const event = {
        date: '2017-11-07',
        role: 'Usher/Offering',
        name: 'Christine Yang'
      };
      return request(app)
        .put('/api/events')
        .send(event)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res) {
          expect(res.body.result).to.equal('OK');
        });
    });
  });
});
