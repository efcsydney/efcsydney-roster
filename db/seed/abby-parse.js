'use strict';

const Repository = require('../../api/data/repository').Repository;
var Papa = require('papaparse');
var fs = require('fs');
var file = 'roster.csv';

var content = fs.readFileSync(file, { encoding: 'binary' });
var data = Papa.parse(content, {
	complete: function(results) {
	}
});

// delete extra data
for (var n = 0; n <= 3; n++){
  var rmfront0 = data['data'].shift();
}
  var position = data['data'].shift();

for (var m = 0; m <= 10; m++){
  var rmend = data['data'].pop();
}

// generate data for DB
for (var i = 0; i <= data['data'].length; i++){
  for (var j = 1; j <= 8; j++){
    Repository.saveEvent({
      volunteerName: data['data'][i][j+1],
      calendar: {date: data['data'][i][1]},
      position: {name: position[j+1]}
      }
    )
  }
}