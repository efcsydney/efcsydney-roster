const chai = require('chai');
const chaiExclude = require('chai-exclude');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../app').app;
const createSeed = require('../helpers/test-helper').createSeed;

const schema = require('../../api2/graphql/schema');

describe('GraphQL', function() {
  beforeEach(function() {
    return createSeed();
  });
  describe('Schema', function() {
    it('Contains Events fields', function() {
      expect(schema.get);
    });
  });
});
