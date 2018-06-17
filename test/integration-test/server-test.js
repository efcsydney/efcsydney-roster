const chai = require('chai');
const chaiExclude = require('chai-exclude');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../app').app;
const createSeed = require('../helpers/test-helper').createSeed;

chai.use(chaiExclude);

describe('Server', function() {
  this.timeout(5000);

  beforeEach(function() {
    return createSeed();
  });
  describe('get events', function() {
    it('returns no data if no data around the period', function() {
      return request(app)
        .get('/api/events?from=2017-03-01&to=2017-03-27&category=english')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => expect(res.body.data.length).to.equal(0));
    });

    it('returns 2 weeks of English service data between 2017-10-01 and 2017-10-15', function() {
      return request(app)
        .get('/api/events?from=2017-10-08&to=2017-10-15&category=english')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          const expected = [
            {
              date: '2017-10-15',
              serviceInfo: {
                id: 3,
                footnote: 'english footnote 2',
                skipService: false,
                skipReason: '',
                category: 'english',
                date: '2017-10-15'
              },
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
              serviceInfo: {
                id: 1,
                footnote: 'english footnote 1',
                skipService: false,
                skipReason: '',
                category: 'english',
                date: '2017-10-08'
              },
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
          ];

          chai.assert.deepEqualExcluding(res.body.data, expected, ['id']);
        });
    });

    it('returns 2 weeks of Chinese service data between 2017-10-01 and 2017-10-15', function() {
      return request(app)
        .get('/api/events?from=2017-10-08&to=2017-10-15&category=chinese')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          const expected = [
            {
              date: '2017-10-15',
              serviceInfo: {
                id: 4,
                footnote: 'chinese footnote 2',
                skipService: false,
                skipReason: '',
                category: 'chinese',
                date: '2017-10-15'
              },
              members: [
                { role: '證道', name: 'Christine Yang' },
                { role: '司會', name: 'Raymond Tsang' },
                { role: '詩歌讚美', name: 'Kai Chang' },
                { role: '司琴', name: 'Christine Yang' },
                { role: '招待', name: 'Christine Yang' },
                { role: '司獻', name: 'Raymond Tsang' },
                { role: '聖餐聖洗', name: 'Kai Chang' },
                { role: '投影', name: 'Christine Yang' },
                { role: '音控', name: 'Christine Yang' },
                { role: '燈光', name: 'Raymond Tsang' },
                { role: '督堂', name: 'Kai Chang' },
                { role: '愛餐', name: 'Christine Yang' }
              ]
            },
            {
              date: '2017-10-08',
              serviceInfo: {
                id: 2,
                footnote: 'chinese footnote 1',
                skipService: false,
                skipReason: '',
                category: 'chinese',
                date: '2017-10-08'
              },
              members: [
                { role: '證道', name: 'May Chien' },
                { role: '司會', name: 'Angela Sun' },
                { role: '詩歌讚美', name: 'Edison Huang' },
                { role: '司琴', name: 'Joseph Wang' },
                { role: '招待', name: 'Cheer Lin' },
                { role: '司獻', name: 'Raymond Tsang' },
                { role: '聖餐聖洗', name: 'Kai Chang' },
                { role: '投影', name: 'Christine Yang' },
                { role: '音控', name: 'Rev. Kian Holik' },
                { role: '燈光', name: 'Jennifer Chu' },
                { role: '督堂', name: 'Amy Chen' },
                { role: '愛餐', name: 'Yvonne Lu' }
              ]
            }
          ];

          chai.assert.deepEqualExcluding(res.body.data, expected, ['id']);
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
        name: 'Kai Chang',
        serviceInfo: {
          category: 'english',
          date: '2017-10-21T13:00:00.000Z',
          footnote: '',
          skipService: false,
          skipReason: '',
          id: 5
        }
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
        name: 'Kai Chang',
        serviceInfo: {
          category: 'english',
          date: '2017-10-22',
          footnote: '',
          skipService: false,
          skipReason: '',
          id: 5
        }
      };
      return request(app)
        .put('/api/events')
        .send(event)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res) {
          expect(res.body.result).to.equal('OK');
          expect(res.body.data.date).to.equal(event.date);
          expect(res.body.data.role).to.equal(event.role);
        });
    });
  });
  describe('update/create serviceInfo', function() {
    it('updates a serviceInfo', function() {
      const footnote = {
        date: '2017-10-08',
        category: 'english',
        footnote: 'Meeting (Election)',
        skipService: true,
        skipReason: 'Combined Service'
      };
      const serviceInfoId = 1;
      return request(app)
        .put(`/api/serviceInfo/${serviceInfoId}`)
        .send(footnote)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res) {
          expect(res.body.result).to.equal('OK');
          expect(res.body.data.id).to.equal(1);
          expect(res.body.data.skipService).to.equal(footnote.skipService);
          expect(res.body.data.footnote).to.equal(footnote.footnote);
        });
    });
    it('creates a serviceInfo', function() {
      const footnote = {
        date: '2016-01-01',
        category: 'english',
        footnote: 'Meeting (Election)',
        skipService: true,
        skipReason: 'Combined Service'
      };

      return request(app)
        .post(`/api/serviceInfo`)
        .send(footnote)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function(res) {
          expect(res.body.result).to.equal('OK');
          expect(res.body.data.id).to.greaterThan(0);
          expect(res.body.data.skipService).to.equal(footnote.skipService);
          expect(res.body.data.footnote).to.equal(footnote.footnote);
        });
    });
  });

  describe('Service API', function() {
    it('creates a new service', function() {
      const service = {
        name: 'new-service',
        locale: 'zh-TW',
        label: 'New Service 1',
        footnoteLabel: 'Service Footnote',
        frequency: 'Sunday',
        positions: []
      };

      return request(app)
        .post(`/api/services`)
        .send(service)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.result).to.equal('OK');
          expect(res.body.data.id).to.greaterThan(0);
          expect(res.body.data.name).to.equal(service.name);
        });
    });
    it('creates a new service with new positions', function() {
      const service = {
        name: 'new-service-2',
        locale: 'zh-TW',
        label: 'New Service 2',
        footnoteLabel: 'Service Footnote',
        frequency: 'Sunday',
        positions: [
          { name: 'Position 1', order: '1' },
          { name: 'Position 2', order: '2' }
        ]
      };

      return request(app)
        .post(`/api/services`)
        .send(service)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body.result).to.equal('OK');
          expect(res.body.data.id).to.greaterThan(0);
          expect(res.body.data.name).to.equal(service.name);
          expect(res.body.data.positions.length).to.equal(2);
          expect(res.body.data.positions[0].name).to.equal(
            service.positions[0].name
          );
          expect(res.body.data.positions[1].name).to.equal(
            service.positions[1].name
          );
        });
    });
  });
});
