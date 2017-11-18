const EventRepository = require('../data/event-repository').EventRepository;
const MockRepository = require('../data/mock-repository').MockRepository;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const MockEventMapper = require('../mapper/mock-event-mapper').MockEventMapper;
class Factory{
  static getRepository(req){
    if(req.query.mock === undefined || req.query.mock !== "true"){
      console.log(req.query.mock);
      return EventRepository;
    }
    else{
      return MockRepository;
    }
  }
  static getDataMapper(req){
    if(req.query.mock === undefined || req.query.mock !== "true"){
      return EventMapper;
    }else{
      return MockEventMapper;
    }
  }
}

module.exports = {
  Factory
}