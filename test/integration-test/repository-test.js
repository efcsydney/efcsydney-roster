const chai = require('chai');
const expect = chai.expect;
const Repository = require('../../api/data/repository').Repository;
const Event = require('../../api/models/event').Event;

describe('Repository', function() {
  describe('/', function() {
    it('gets events by date range', function() {
      return Repository.getEventsByDateRange({from: new Date("2017-10-01"), to: new Date("2017-11-01")})
        .then(function(events) {
          expect(16).to.equal(events.length);
        });
    });

    it('inserts new event', function() {
      var newEvent = {volunteerName: 'Kyle Huang', calendar: {date: new Date()}, position: { name: 'Speaker'}};
      return Repository.saveEvent(newEvent)
        .then(function(event) {
          const createdEvent = Event.findOne({ where: { id: event.id }});
          console.log(createdEvent);
          expect('Kyle Huang').to.equal(event.volunteerName);
        })
        .catch(function (err) {
          console.log(err)
          expect(1).to.equal(2);
        });
    });
  });
});

