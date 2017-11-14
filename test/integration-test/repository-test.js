const chai = require('chai');
const expect = chai.expect;
const Repository = require('../../api/data/repository').Repository;
const Event = require('../../api/models/event').Event;
const Calendar = require('../../api/models/calendar').Calendar;
const Position = require('../../api/models/position').Position;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

describe('Repository', function() {
  describe('/', function() {
    it('gets events by date range', function() {
      return Repository.getEventsByDateRange({from: new Date("2017-10-01"), to: new Date("2017-11-01")})
        .then(function(events) {
          expect(16).to.equal(events.length);
        });
    });

    it('inserts new event', function() {
      const newEvent = {volunteerName: 'Kyle Huang', calendar: {date: new Date("2017-11-25")}, position: { name: 'Speaker'}};
      return Repository.saveEvent(newEvent)
        .then(function(event) {
          return Event.findOne({include: [
            { model: Calendar, as: 'calendar', where: { date: {[Op.eq]: newEvent.calendar.date}}},
            { model: Position, as: 'position', where: { name: newEvent.position.name} }]});
        })
        .then(function(createdEvent){
          console.log(createdEvent);
          expect('Kyle Huang').to.equal(createdEvent.volunteerName);
          return Event.destroy({where: {id: createdEvent.id }});
        })
        .then(function(){
          console.log("Data is removed. Test is completed.");
        })
        .catch(function (err) {
          console.log(err)
          expect(1).to.equal(2);
        });
    });

    it('updates existing event', function() {
      const existingEvent = {volunteerName: 'Jimmy Wong', calendar: {date: new Date('2017-10-08')}, position: { name: 'Speaker'}};
      return Repository.updateEvent(existingEvent)
        .then(function() {
          return Event.findOne({include: [
            { model: Calendar, as: 'calendar', where: { date: {[Op.eq]: existingEvent.calendar.date}}},
            { model: Position, as: 'position', where: { name: existingEvent.position.name} }]});
        })
        .then(function(updatedEvent){
          console.log(updatedEvent);
          expect('Jimmy Wong').to.equal(updatedEvent.volunteerName);
        })
        .then(function(){
          const originalEvent = {volunteerName: 'May Chien', calendar: {date: new Date('2017-10-08')}, position: { name: 'Speaker'}};
          return Repository.updateEvent(originalEvent);
        })
        .then(function(){
          console.log("Data is restored. Test is completed.");
        })
        .catch(function (err) {
          console.log(err)
          expect(1).to.equal(2);
        });
    });
  });
});

