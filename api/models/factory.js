class Factory {
  static createEvent(volunteerName, position, date) {
    return {
      volunteerName: '',
      position: { name: position.name },
      calendarDate: { date: date }
    };
  }
}

module.exports = {
  Factory
};
