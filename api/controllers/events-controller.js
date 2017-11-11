const Event = require('../models/event').Event;
const Calendar = require('../models/calendar').Calendar;
const Position = require('../models/position').Position;

async function getEvents(req, res) {
  const events = await Event.findAll({
    include: [{
      model: Calendar,
      where: {
        date: new Date("2017-10-08T00:00:00Z")
      }
    },{
      model: Position,
    }],
  });
  const members = events.map((e) => {
    return {
      role: e.position.name,
      name: e.volunteerName
    }
  })
  const response = {
    date: "2017-10-08T00:00:00Z",
    members
  }
  console.log(JSON.stringify(response, null, 2));
  return res.json(response);
}

module.exports = {
  getEvents
}