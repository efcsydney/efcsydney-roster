const EventMapper = require('../../api/mapper/event-mapper').EventMapper;
const chai = require('chai');

const expect = chai.expect;

describe('Event Mapper', function() {
  describe('Convert Events Model to a Group of Events by Date', function() {
    it('converts events model', function() {
      const eventsModel = [
        {
          volunteerName: 'Kyle Huang',
          calendarDate: { date: '2017-01-01' },
          position: { name: 'Speaker' }
        },
        {
          volunteerName: 'Mei Liu',
          calendarDate: { date: '2017-01-01' },
          position: { name: 'Speaker' }
        },
        {
          volunteerName: 'Bo Qi',
          calendarDate: { date: '2017-01-04' },
          position: { name: 'Tester' }
        },
        {
          volunteerName: 'Joseph Cheung',
          calendarDate: { date: '2017-01-04' },
          position: { name: 'Moderator' }
        }
      ];

      const expectedModel = [
        {
          date: new Date('2017-01-01'),
          positions: [
            { volunteerName: 'Kyle Huang', position: 'Speaker' },
            { volunteerName: 'Mei Liu', position: 'Speaker' }
          ]
        },
        {
          date: new Date('2017-01-04'),
          positions: [
            { volunteerName: 'Bo Qi', position: 'Tester' },
            { volunteerName: 'Joseph Cheung', position: 'Moderator' }
          ]
        }
      ];

      const actualModel = EventMapper.groupEventsByCalendarDate(eventsModel);

      expect(2).to.eq(actualModel.length);
      expect(actualModel[0].positions[0].volunteerName).to.eq(
        expectedModel[0].positions[0].volunteerName
      );
      expect(actualModel[0].positions[0].position).to.eq(
        expectedModel[0].positions[0].position
      );
      expect(actualModel[1].positions[0].volunteerName).to.eq(
        expectedModel[1].positions[0].volunteerName
      );
      expect(actualModel[1].positions[0].position).to.eq(
        expectedModel[1].positions[0].position
      );
    });
  });

  describe('Map Footnotes to Group of Events', function() {
    it('converts events model', function() {
      const groupEvents = [
        {
          date: '2017-11-05',
          positions: [
            {
              volunteerName: 'Kyle Huang',
              position: 'Speaker'
            },
            {
              volunteerName: 'Mei Liu',
              position: 'Speaker'
            },
            {
              volunteerName: 'Bo Qi',
              position: 'Tester'
            },
            {
              volunteerName: 'Joseph Cheung',
              position: 'Moderator'
            }
          ]
        },
        {
          date: '2017-11-12',

          positions: [
            {
              volunteerName: 'Jimmy Wong',
              position: 'Speaker'
            },
            {
              volunteerName: 'Kathy Chang',
              position: 'Speaker'
            },
            {
              volunteerName: 'Stanley Chu',
              position: 'Tester'
            },
            {
              volunteerName: 'Debby Sutherland',
              position: 'Moderator'
            }
          ]
        }
      ];
      const footNoteModel = [
        {
          id: 3,
          calendarDate: { date: '2017-11-05' },
          name: 'Combined Service'
        },
        {
          id: 2,
          calendarDate: { date: '2017-11-12' },
          name: ''
        }
      ];

      const expectedModel = [
        {
          date: '2017-11-05',
          footnote: {
            id: 3,
            name: 'Combined Service'
          },
          positions: [
            { volunteerName: 'Kyle Huang', position: 'Speaker' },
            { volunteerName: 'Mei Liu', position: 'Speaker' }
          ]
        },
        {
          date: '2017-11-12',
          footnote: {
            id: 2,
            name: ''
          },
          positions: [
            { volunteerName: 'Jimmy Wong', position: 'Speaker' },
            { volunteerName: 'Kathy Chang', position: 'Moderator' }
          ]
        }
      ];

      const actualModel = EventMapper.mapFootnotesToEvents(
        footNoteModel,
        groupEvents
      );

      expect(2).to.eq(actualModel.length);
      expect(actualModel[0].footnote.id).to.eq(expectedModel[0].footnote.id);
      expect(actualModel[0].footnote.name).to.eq(
        expectedModel[0].footnote.name
      );
      expect(actualModel[1].footnote.id).to.eq(expectedModel[1].footnote.id);
      expect(actualModel[1].footnote.name).to.eq(
        expectedModel[1].footnote.name
      );
    });
  });
});
