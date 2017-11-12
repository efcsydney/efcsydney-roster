const chai = require('chai');
const expect = chai.expect;
const Repository = require('../../api/data/repository').Repository;

describe('Repository', function() {
  describe('/', function() {
    it('gets events by date range', function() {
      return Repository.getEventsByDateRange(new Date("2017-10-01"),new Date("2017-11-01"))
        .then(function(events) {
          expect(16).to.equal(events.length);
        });
    });

    it('inserts new event', function() {
      var newEvent = {id: 0, volunteerName: 'Kyle Huang', calendar: {date: new Date()}, position: { name: 'Speaker'}};
      return Repository.saveEvent(newEvent)
        .then(function(event) {
          expect('Kyle Huang').to.equal(event.volunteerName);
        });
    });
  });
});

