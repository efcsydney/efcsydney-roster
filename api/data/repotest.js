const Repository = require('./eventRrepository');


const repo = new Repository();

const list = repo.between('2017-01-01', '2017-02-25').executeAsync();

list.then(function(events){
    
        console.log(`length ${events.length}`);
        if(events.length > 0){
            let event = events[0];
            console.log(`name: ${event.volunteerName}`);
            console.log(`date: ${event.calendar.date}`);
            console.log(`position: ${event.position.name}`);
        }
    
})
