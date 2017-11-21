const EventRepository = require('../data/event-repository').EventRepository;
const MockRepository = require('../data/mock-repository').MockRepository;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const MockEventMapper = require('../mapper/mock-event-mapper').MockEventMapper;
class Factory{
  static getRepository(req){
    if(process.env.NODE_ENV === 'production' || req.query.mock === "false"){
      return EventRepository;
    }
    else{
      return MockRepository;
    }
  }
  static getDataMapper(req){
    if(process.env.NODE_ENV === 'production' || req.query.mock === "false"){
      return EventMapper;
    }else{
      return MockEventMapper;
    }
  }
}

module.exports = {
  Factory
}