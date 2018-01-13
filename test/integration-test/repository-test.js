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
  this.timeout(5000);

  describe('Events', function() {
    beforeEach(function() {
      return createSeed();
    });
    it('gets english events by date range', function() {
      return EventRepository.getEventsByDateRange(
        {
          from: new Date('2017-10-08'),
          to: new Date('2017-10-15')
        },
        'english'
      ).then(function(events) {
        expect(events.length).to.equal(16);
      });
    });

    it('gets chinese events by date range', function() {
      return EventRepository.getEventsByDateRange(
        {
          from: new Date('2017-10-08'),
          to: new Date('2017-10-15')
        },
        'chinese'
      ).then(function(events) {
        expect(events.length).to.equal(24);
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
