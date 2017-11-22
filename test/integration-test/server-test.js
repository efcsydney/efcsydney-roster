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
          expect(4).to.equal(res.body.data.length);
        });
    });

    it('returns the 3 weeks of data between 2017-10-01 and 2017-10-15', function() {
      return request(app)
        .get('/api/events?from=2017-10-01&to=2017-10-15&mock=false')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(3).to.equal(res.body.data.length);
        });
    });

    it('returns 12 weeks of date by default when the end date is not specified', function() {
      return request(app)
        .get('/api/events?from=2017-09-02&mock=false')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(12).to.equal(res.body.data.length);
        });
    });

    it('returns 12 week of date by default when the start date and end date are not specified', function() {
      return request(app)
        .get('/api/events?mock=false')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(12).to.equal(res.body.data.length);
        });
    });
  });
});