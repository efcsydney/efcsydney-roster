'use strict';

// use Papaparse: make csv become js
var Papa = require('papaparse');
var fs = require('fs');
var file = 'roster.csv';

var content = fs.readFileSync(file, { encoding: 'binary' });
var data = Papa.parse(content, {
	complete: function(results) {
	}
});

// delete extra data
for (var n = 0; n <= 4; n++){
  var rmfront = data['data'].shift();
}

for (var m = 0; m <= 10; m++){
  var rmend = data['data'].pop();
}

// generate data array for DB
var con = []

for (var i = 0; i <= data['data'].length; i++){
  for (var j = 1; j <= 8; j++){
    con = [
      {
      volunteerName: data['data'][i][j+1],
      calendarId: data['data'][i][1],
      positionId: j-1,
      createdAt: new Date(),
      updatedAt: new Date()
      }
    ]
  console.log(con)
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('events', content, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {});
  }
};