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

  describe('Map ServiceInfo to Group of Events', function() {
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
      const serviceInfoModel = [
        {
          id: 3,
          calendarDate: { date: '2017-11-05' },
          footnote: 'Combined Service',
          skipService: false,
          skipReason: 'Combined Service ...',
        },
        {
          id: 2,
          calendarDate: { date: '2017-11-12' },
          footnote: '',
          skipService: false,
          skipReason: 'Combined Service ...',
        }
      ];

      const expectedModel = [
        {
          date: '2017-11-05',
          serviceInfo: {
            id: 3,
            footnote: 'Combined Service',
            skipService: false,
            skipReason: 'Combined Service ...',
          },
          positions: [
            { volunteerName: 'Kyle Huang', position: 'Speaker' },
            { volunteerName: 'Mei Liu', position: 'Speaker' }
          ]
        },
        {
          date: '2017-11-12',
          serviceInfo: {
            id: 2,
            footnote: '',
            skipService: false,
            skipReason: 'Combined Service ...',
          },
          positions: [
            { volunteerName: 'Jimmy Wong', position: 'Speaker' },
            { volunteerName: 'Kathy Chang', position: 'Moderator' }
          ]
        }
      ];

      const actualModel = EventMapper.mapServiceInfoToEvents(
        serviceInfoModel,
        groupEvents
      );

      expect(2).to.eq(actualModel.length);
      expect(actualModel[0].serviceInfo.id).to.eq(expectedModel[0].serviceInfo.id);
      expect(actualModel[0].serviceInfo.footnote).to.eq(
        expectedModel[0].serviceInfo.footnote
      );
      expect(actualModel[1].serviceInfo.id).to.eq(expectedModel[1].serviceInfo.id);
      expect(actualModel[1].serviceInfo.footnote).to.eq(
        expectedModel[1].serviceInfo.footnote
      );
    });
  });
});
