const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../app').app;
const createSeed = require('../helpers/test-helper').createSeed;

describe('Server', function() {
  beforeEach(function() {
    return createSeed();
  });
  describe('get events', function() {
    it('returns no data if no data around the period', function() {
      return request(app)
        .get('/api/events?from=2017-03-01&to=2017-03-27')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => expect(res.body.data.length).to.equal(0));
    });

    it('returns 2 weeks of data between 2017-10-01 and 2017-10-15', function() {
      return request(app)
        .get('/api/events?from=2017-10-08&to=2017-10-15&category=english')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.data).to.eql([
            {
              date: '2017-10-15',
              members: [
                { role: 'Speaker', name: 'Rev. Kian Holik' },
                { role: 'Moderator', name: 'Jennifer Chu' },
                { role: 'P&W', name: 'Amy Chen' },
                { role: 'Pianist', name: 'Yvonne Lu' },
                { role: 'Usher/Offering', name: 'Christine Yang' },
                { role: 'PA/PPT', name: 'Raymond Tsang' },
                { role: 'Newsletter', name: 'Kai Chang' },
                { role: 'Refreshments', name: 'Christine Yang' }
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
            }
          ]);
        });
    });

    it('returns the next 12 weeks of date by default when the end date is not specified', function() {
      return request(app)
        .get('/api/events?from=2017-08-02&category=english')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.data.length).to.eql(3); // because only the last 3 weeks have data in DB
        });
    });
  });
  describe('update event', function() {
    it('updates an event where its time contains timezone info', function() {
      const event = {
        date: '2017-10-21T13:00:00.000Z',
        role: 'Usher/Offering',
        name: 'Kai Chang'
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
        date: '2017-10-22',
        role: 'Usher/Offering',
        name: 'Kai Chang'
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
