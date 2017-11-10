const express = require("express");
const fs = require("fs");
const sqlite = require("sql.js");

const filebuffer = fs.readFileSync("db/usda-nnd.sqlite3");

const db = new sqlite.Database(filebuffer);

const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const COLUMNS = [
  "carbohydrate_g",
  "protein_g",
  "fa_sat_g",
  "fa_mono_g",
  "fa_poly_g",
  "kcal",
  "description"
];
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
      },
      {
        "date": "2017-10-29",
        "members": [
          {"role": "Speaker", "name": "Rev. Kian Holic"},
          {"role": "Moderator", "name": "Bobby Lu"},
          {"role": "P&W", "name": "Robin Zhang"},
          {"role": "Pianist", "name": "Angela Sun"},
          {"role": "Usher/Offering", "name": "Kai Chang"},
          {"role": "PA/PPT", "name": "Raymond Tsang"},
          {"role": "Newsletter", "name": "Joseph Chiang"},
          {"role": "Refreshments", "name": "Christine Yang"}
        ]
      },
      {
        "date": "2017-11-5",
        "members": [
          {"role": "Speaker", "name": "Rev. Kian Holik"},
          {"role": "Moderator", "name": "Gary Tan"},
          {"role": "P&W", "name": "Jenny Hsu"},
          {"role": "Pianist", "name": "Amy Chen"},
          {"role": "Usher/Offering", "name": "Cheer Lin"},
          {"role": "PA/PPT", "name": "Raymond Tsang"},
          {"role": "Newsletter", "name": "Kai Chang"},
          {"role": "Refreshments", "name": "Christine Yang"}
        ]
      },
      {
        "date": "2017-11-12",
        "members": [
          {"role": "Speaker", "name": "Aaron Goh"},
          {"role": "Moderator", "name": "Jennifer Chu"},
          {"role": "P&W", "name": "Amy Chen"},
          {"role": "Pianist", "name": "Brian Chen"},
          {"role": "Usher/Offering", "name": "Christine Yang"},
          {"role": "PA/PPT", "name": "Raymond Tsang"},
          {"role": "Newsletter", "name": "Joseph Chiang"},
          {"role": "Refreshments", "name": "Christine Yang"}
        ]
      },
      {
        "date": "2017-11-19",
        "members": [
          {"role": "Speaker", "name": "Kathleen Kao"},
          {"role": "Moderator", "name": "Angela Sun"},
          {"role": "P&W", "name": "Yvonne Lu"},
          {"role": "Pianist", "name": "Amy Chen"},
          {"role": "Usher/Offering", "name": "Cheer Lin"},
          {"role": "PA/PPT", "name": "Raymond Tsang"},
          {"role": "Newsletter", "name": "Kai Chang"},
          {"role": "Refreshments", "name": "Christine Yang"}
        ]
      },
      {
        "date": "2017-11-26",
        "members": [
          {"role": "Speaker", "name": "David Luis"},
          {"role": "Moderator", "name": "Gary Tan"},
          {"role": "P&W", "name": "Dan Kao"},
          {"role": "Pianist", "name": "Yvonne Lu"},
          {"role": "Usher/Offering", "name": "Kai Chang"},
          {"role": "PA/PPT", "name": "Raymond Tsang & Jenny Shao"},
          {"role": "Newsletter", "name": "Joseph Chiang"},
          {"role": "Refreshments", "name": "Christine Yang"}
        ]
      },
      {
        "date": "2017-12-3",
        "members": [
          {"role": "Speaker", "name": ""},
          {"role": "Moderator", "name": "Bobby Lu"},
          {"role": "P&W", "name": "Yvonne Lu"},
          {"role": "Pianist", "name": "Angela Sun"},
          {"role": "Usher/Offering", "name": "Christine Yang"},
          {"role": "PA/PPT", "name": "Raymond Tsang"},
          {"role": "Newsletter", "name": "Kai Chang"},
          {"role": "Refreshments", "name": "Christine Yang"}
        ]
      },
      {
        "date": "2017-12-10",
        "members": [
          {"role": "Speaker", "name": "Gary Tan"},
          {"role": "Moderator", "name": "Dan Kao"},
          {"role": "P&W", "name": "Betty Chen"},
          {"role": "Pianist", "name": "Amy Chen"},
          {"role": "Usher/Offering", "name": "Cheer Lin"},
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

app.get("/api/food", (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.
  const r = db.exec(
    `
    select ${COLUMNS.join(", ")} from entries
    where description like '%${param}%'
    limit 100
  `
  );

  if (r[0]) {
    res.json(
      r[0].values.map(entry => {
        const e = {};
        COLUMNS.forEach((c, idx) => {
          // combine fat columns
          if (c.match(/^fa_/)) {
            e.fat_g = e.fat_g || 0.0;
            e.fat_g = (parseFloat(e.fat_g, 10) +
              parseFloat(entry[idx], 10)).toFixed(2);
          } else {
            e[c] = entry[idx];
          }
        });
        return e;
      })
    );
  } else {
    res.json([]);
  }
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
