const chai = require('chai');
const expect = chai.expect;
const EventRepository = require('../../api/data/event-repository')
  .EventRepository;
const Event = require('../../api/models/event').Event;
const CalendarDate = require('../../api/models/calendar-date').CalendarDate;
const Position = require('../../api/models/position').Position;
const createSeed = require('../helpers/test-helper').createSeed;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

describe('Repository', function() {
  describe('Events', function() {
    beforeEach(function() {
      return createSeed();
    });
    it('gets events by date range', function() {
      return EventRepository.getEventsByDateRange({
        from: new Date('2017-10-08'),
        to: new Date('2017-11-01')
      }).then(function(events) {
        expect(events.length).to.equal(16);
      });
    });

    it('gets events by date and position', function() {
      return EventRepository.getEventByDatePosition({
        date: new Date('2017-10-15'),
        position: 'P&W'
      })
        .then(function(event) {
          expect('Amy Chen').to.equal(event.volunteerName);
        })
        .catch(function(err) {
          expect(1).to.equal(2);
        });
    });

    it('inserts new event', function() {
      const newEvent = {
        volunteerName: 'Kyle Huang',
        calendarDate: { date: new Date('2017-11-25') },
        position: { name: 'Speaker' }
      };
      return EventRepository.addEvent(newEvent)
        .then(function(event) {
          return Event.findOne({
            include: [
              {
                model: CalendarDate,
                as: 'calendarDate',
                where: { date: { [Op.eq]: newEvent.calendarDate.date } }
              },
              {
                model: Position,
                as: 'position',
                where: { name: newEvent.position.name }
              }
            ]
          });
        })
        .then(function(createdEvent) {
          expect('Kyle Huang').to.equal(createdEvent.volunteerName);
          return Event.destroy({ where: { id: createdEvent.id } });
        })
        .catch(function(err) {
          expect(1).to.equal(2);
        });
    });

    it('updates existing event', function() {
      const expectedName = 'Jimmy Wong';
      const existingEvent = {
        volunteerName: expectedName,
        calendarDate: { date: new Date('2017-10-08') },
        position: { name: 'Speaker' }
      };
      return EventRepository.getEventByDatePosition({
        date: new Date('2017-10-08'),
        position: 'Speaker'
      })
        .then(function(event) {
          event.volunteerName = expectedName;
          return EventRepository.updateEvent(event);
        })
        .then(function() {
          return Event.findOne({
            include: [
              {
                model: CalendarDate,
                as: 'calendarDate',
                where: { date: { [Op.eq]: existingEvent.calendarDate.date } }
              },
              {
                model: Position,
                as: 'position',
                where: { name: existingEvent.position.name }
              }
            ]
          });
        })
        .then(function(updatedEvent) {
          expect(expectedName).to.equal(updatedEvent.volunteerName);

          updatedEvent.volunteerName = 'May Chien';
          return EventRepository.updateEvent(updatedEvent);
        })
        .catch(function(err) {
          expect(1).to.equal(2);
        });
    });
  });
});
