class EventMapper {

  static convertEventsModelToDto(events){
    const eventDates = [];

    events.map((e) => {
      const eventDate = eventDates.find((event) =>{
        return event.date.getTime() == e.calendarDate.date.getTime();
      });

      const event = {role: e.position.name, name: e.volunteerName};

      if(eventDate !== undefined){
        eventDate.members.push(event);
      }else{
        eventDates.push({date: e.calendarDate.date, members: [event] })
      }
    });

    return eventDates;
  }

  static convertDtoToEventModel(data){
    const event = {volunteerName: data.name, calendarDate: {date: new Date(data.date)}, position: {name: data.position}};
    return event;
  }
}

module.exports = { EventMapper }