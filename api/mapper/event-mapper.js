class EventMapper {

  static convertEventsModelToDto(events){
    const eventDates = [];
    
    events.map((e) => {
      const eventDate = eventDates.find((event) =>{
        return event.date.getTime() == e.calendar.date.getTime();
      });

      const event = {position: e.position.name, name: e.volunteerName};

      if(eventDate !== undefined){
        eventDate.members.push(event);
      }else{
        eventDates.push({date: e.calendar.date, members: [event] })
      }
    });

    return eventDates;
  }
}

module.exports = { EventMapper }