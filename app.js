const express = require("express");
app = express();
module.exports.app = app;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello Guys! Welcome to roster!' });
})

app.get('/api/events', (req, res) => {
  res.json({
    "data": [
      {
        "date": "2017-10-08",
        "members": [
          {"role": "Speaker", "name": "May Chien"},
          {"role": "Moderator", "name": "Angela Sun"},
          {"role": "P&W", "name": "Edison Huang"},
          {"role": "Pianist", "name": "Joseph Wang"},
          {"role": "Usher/Offering", "name": "Cheer Lin"},
          {"role": "PA/PPT", "name": "Raymond Tsang"},
          {"role": "Newsletter", "name": "Kai Chang"},
          {"role": "Refreshments", "name": "Christine Yang"}
        ]
      },
      {
        "date": "2017-10-15",
        "members": [
          {"role": "Speaker", "name": "Rev. Kian Holik"},
          {"role": "Moderator", "name": "Jennifer Chu"},
          {"role": "P&W", "name": "Amy Chen"},
          {"role": "Pianist", "name": "Yvonne Lu"},
          {"role": "Usher/Offering", "name": "Christine Yang"},
          {"role": "PA/PPT", "name": "Raymond Tsang"},
          {"role": "Newsletter", "name": "Kai Chang"},
          {"role": "Refreshments", "name": "Christine Yang"}
        ]
      }
    ],
    "error": {}
  });
  return;
});