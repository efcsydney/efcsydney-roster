const EventService = require('../../api/service/events-service').EventService;
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

describe('Event Service', function() {
  describe('Compute date range', function() {
    let sandbox, clock, now;
    beforeEach(function() {
      now = new Date();
      sandbox = sinon.createSandbox();
      clock = sandbox.useFakeTimers(now.getTime());
    });
    afterEach(function() {
      sandbox.restore();
      clock.restore();
    });
    it('computes end date if not specified', function() {
      const expectedDateRange = {
        from: new Date('2017-11-01'),
        to: new Date('2018-01-24')
      };
      const actualDateRange = EventService.computeDateRange({
        from: new Date('2017-11-01')
      });

      expect(expectedDateRange.to.getTime()).to.eq(
        actualDateRange.to.getTime()
      );
    });

    it('returns the specified end date', function() {
      const expectedDateRange = {
        from: new Date('2017-11-01'),
        to: new Date('2017-12-24')
      };
      const actualDateRange = EventService.computeDateRange({
        from: new Date('2017-11-01'),
        to: new Date('2017-12-24')
      });

      expect(expectedDateRange.to.getTime()).to.eq(
        actualDateRange.to.getTime()
      );
      expect(expectedDateRange.from.getTime()).to.eq(
        actualDateRange.from.getTime()
      );
    });

    it('set start date to today if not specified', function() {
      const expectedDateRange = {
        from: new Date('2017-11-01'),
        to: new Date('2018-01-24')
      };
      const actualDateRange = EventService.computeDateRange({});

      expect(now.toString()).to.eq(actualDateRange.from.toString());
    });
  });
});
