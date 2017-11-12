const ModelMapper = require("../../api/mapper/model-mapper").ModelMapper;
const chai = require('chai');

const expect = chai.expect;

describe('Model Mapper', function() {
  describe('Convert Events Model to DTO', function() {
    it('converts events model', function() {
      const eventsModel = [
        {volunteerName: "Kyle Huang", calendar: {date: new Date("2017-01-01")}, position: {name: "Speaker"}},
        {volunteerName: "Mei Liu", calendar: {date: new Date("2017-01-01")}, position: {name: "Speaker"}},
        {volunteerName: "Bo Qi", calendar: {date: new Date("2017-01-04")}, position: {name: "Tester"}},
        {volunteerName: "Joseph Cheung", calendar: {date: new Date("2017-01-04")}, position: {name: "Moderator"}}];

      const expectedModel = [{date: new Date("2017-01-01"), members: [
        {volunteerName: "Kyle Huang", position: "Speaker"},
        {volunteerName: "Mei Liu", position: "Speaker"},
      ]}, 
      {date: new Date("2017-01-04"), members: [
        {volunteerName: "Bo Qi", position: "Tester"},
        {volunteerName: "Joseph Cheung", position: "Moderator"}
      ]}];

      const actualModel = ModelMapper.convertEventsModelToDto(eventsModel);

      expect(2).to.eq(actualModel.length);
      expect(actualModel[0].members[0].name).to.eq("Kyle Huang");
      expect(actualModel[0].members[0].position).to.eq("Speaker");
      expect(actualModel[1].members[0].name).to.eq("Bo Qi");
      expect(actualModel[1].members[0].position).to.eq("Tester");
    });
  });
});
