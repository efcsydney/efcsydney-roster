const EventService = require('../../api/service/events-service').EventService;
const getDateString = require('../../api/utilities/datetime-util')
  .getDateString;
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

describe('Event Service', function() {
  this.timeout(5000);
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
        from: '2017-11-01',
        to: '2018-01-24'
      };
      const actualDateRange = EventService.computeDateRange({
        from: '2017-11-01'
      });

      expect(expectedDateRange.to).to.eq(actualDateRange.to);
    });

    it('returns the specified end date', function() {
      const expectedDateRange = {
        from: '2017-11-01',
        to: '2017-12-24'
      };
      const actualDateRange = EventService.computeDateRange({
        from: '2017-11-01',
        to: '2017-12-24'
      });

      expect(expectedDateRange.to).to.eq(actualDateRange.to);
      expect(expectedDateRange.from).to.eq(actualDateRange.from);
    });

    it('set start date to today if not specified', function() {
      const expectedDateRange = {
        from: '2017-11-01',
        to: '2018-01-24'
      };
      const actualDateRange = EventService.computeDateRange({});
      expect(getDateString(now)).to.eq(actualDateRange.from.toString());
    });
  });
});
