const EventService = require("../../api/service/events-service").EventService;
const chai = require('chai');
const expect = chai.expect;

describe('Event Service', function() {
  describe('Compute date range', function() {
    it('computes end date if not specified', function() {
      const expectedDateRange = {from: new Date("2017-11-01"), to: new Date("2018-01-24")};
      const actualDateRange = EventService.computeDateRange("2017-11-01");

      expect(expectedDateRange.to.getTime()).to.eq(actualDateRange.to.getTime());
    });

    it('returns the specified end date', function() {
      const expectedDateRange = {from: new Date("2017-11-01"), to: new Date("2017-12-24")};
      const actualDateRange = EventService.computeDateRange("2017-11-01", "2017-12-24");

      expect(expectedDateRange.to.getTime()).to.eq(actualDateRange.to.getTime());
      expect(expectedDateRange.from.getTime()).to.eq(actualDateRange.from.getTime());
    });
  });
});