const chai = require('chai');
const expect = chai.expect;
const EventRepository = require('../../api/data/event-repository').EventRepository;
const Event = require('../../api/models/event').Event;
const CalendarDate = require('../../api/models/calendar-date').CalendarDate;
const Position = require('../../api/models/position').Position;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

describe('Repository', function() {
  describe('/', function() {
    it('gets events by date range', function() {
      return EventRepository.getEventsByDateRange({from: new Date("2017-10-01"), to: new Date("2017-11-01")})
        .then(function(events) {
          expect(16).to.equal(events.length);
        });
    });

    it('gets events by date and position', function() {
      return EventRepository.getEventByDatePosition({date: new Date("2017-10-15"), position: "P&W"})
        .then(function(event) {
          console.log(event);
          expect("Amy Chen").to.equal(event.volunteerName);
        })
        .catch(function (err) {
          console.log(err)
          expect(1).to.equal(2);
        });
    });

    it('inserts new event', function() {
      const newEvent = {volunteerName: 'Kyle Huang', calendarDate: {date: new Date("2017-11-25")}, position: { name: 'Speaker'}};
      return EventRepository.addEvent(newEvent)
        .then(function(event) {
          return Event.findOne({include: [
            { model: CalendarDate, as: 'calendarDate', where: { date: {[Op.eq]: newEvent.calendarDate.date}}},
            { model: Position, as: 'position', where: { name: newEvent.position.name} }]});
        })
        .then(function(createdEvent){
          //console.log(createdEvent);
          expect('Kyle Huang').to.equal(createdEvent.volunteerName);
          return Event.destroy({where: {id: createdEvent.id }});
        })
        .then(function(){
          console.log("Test data is removed. Test is completed.");
        })
        .catch(function (err) {
          console.log(err)
          expect(1).to.equal(2);
        });
    });

    it('updates existing event', function() {
            
      const expectedName = 'Jimmy Wong';
      const existingEvent = {volunteerName: expectedName, calendarDate: {date: new Date('2017-10-08')}, position: { name: 'Speaker'}};
      return EventRepository.getEventByDatePosition({date: new Date('2017-10-08'), position: 'Speaker'})
        .then(function(event){
          event.volunteerName = expectedName;
          return EventRepository.updateEvent(event);
        })
        .then(function() {
          return Event.findOne({include: [
            { model: CalendarDate, as: 'calendarDate', where: { date: {[Op.eq]: existingEvent.calendarDate.date}}},
            { model: Position, as: 'position', where: { name: existingEvent.position.name} }]});
        })
        .then(function(updatedEvent){
          //console.log(updatedEvent);
          expect(expectedName).to.equal(updatedEvent.volunteerName);

          updatedEvent.volunteerName = 'May Chien';
          return EventRepository.updateEvent(updatedEvent);
        })
        .then(function(){
          console.log("Original data is restored. Test is completed.");
        })
        .catch(function (err) {
          console.log(err)
          expect(1).to.equal(2);
        });
    });
  });
});

