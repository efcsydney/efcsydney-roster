const EventMapper = require('../../api/mapper/event-mapper').EventMapper;
const chai = require('chai');

const expect = chai.expect;

describe('Model Mapper', function() {
  describe('Convert Events Model to DTO', function() {
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
          members: [
            { volunteerName: 'Kyle Huang', role: 'Speaker' },
            { volunteerName: 'Mei Liu', role: 'Speaker' }
          ]
        },
        {
          date: new Date('2017-01-04'),
          members: [
            { volunteerName: 'Bo Qi', role: 'Tester' },
            { volunteerName: 'Joseph Cheung', role: 'Moderator' }
          ]
        }
      ];

      const actualModel = EventMapper.convertEventsModelToDto(eventsModel);

      expect(2).to.eq(actualModel.length);
      expect(actualModel[0].members[0].name).to.eq('Kyle Huang');
      expect(actualModel[0].members[0].role).to.eq('Speaker');
      expect(actualModel[1].members[0].name).to.eq('Bo Qi');
      expect(actualModel[1].members[0].role).to.eq('Tester');
    });
  });
});
