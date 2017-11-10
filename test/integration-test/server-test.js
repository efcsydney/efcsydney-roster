const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../app').app;

describe('Server', function() {
  describe('/', function() {
    it('try hello world', function() {
      return request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function(res) {
          expect(res.body).to.deep.equal({
            message: 'Hello Guys! Welcome to roster!'
          });
        });
    });
  });
});