const express = require("express");
const app = express();
const cors = require("cors");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./database.db");

db.run(
  `CREATE TABLE IF NOT EXISTS birthday (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
           name TEXT NOT NULL,
        day TEXT NOT NULL ,
        month TEXT NOT NULL ,
        year TEXT NOT NULL
    );`
);

let records = [];

/*[
  { name: 'Giray', day: '19', month: '06', year: '1992' },
  { name: 'Yağız', day: '21', month: '06', year: '1992' }
]
*/

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/birthday", function (req, res) {
  db.all(`SELECT * FROM birthday`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    console.log(rows);
    res.json(rows);
  });
});

app.get("/birthday/month/:month", function (req, res) {
  const check = req.params.month;
  const array = [];
  db.all(
    `SELECT * FROM birthday WHERE month = ?`,
    [`${check}`],
    (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      console.log(rows);
      res.json(rows);
    }
  );
});

app.get("/birthday/today", function (req, res) {
  const today = new Date();
  let month = today.getMonth() + 1;
  if (month / 10 < 1) {
    month = `0${month}`;
  }
  const array = [];
  console.log(month);
  db.all(
    `SELECT * FROM birthday WHERE month = ?`,
    [`${month}`],
    (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      console.log(rows);
      res.json(rows);
    }
  );
});

app.get("/birthday/:name", function (req, res) {
  const check = req.params.name;
  db.all(`SELECT * FROM birthday WHERE name = ?`, [`${check}`], (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    console.log(rows);
    res.json(rows);
  });
});

//Upcoming: List the birthdays that are in current month but only the non-past dates

app.post("/birthday", function (req, res) {
  const name = req.body.name;
  let day = req.body.day;
  let month = req.body.month;
  const year = req.body.year;

  if (day / 10 < 1) {
    day = `0${day}`;
  }

  if (month / 10 < 1) {
    month = `0${month}`;
  }

  let record = {
    name: name,
    day: day,
    month: month,
    year: year,
  };
  records.push(record);
  db.run(
    `INSERT INTO birthday(name, day, month, year) VALUES(?,?,?,?)`,
    [
      `${req.body.name}`,
      `${req.body.day}`,
      `${req.body.month}`,
      `${req.body.year}`,
    ],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
  res.json({ bday: `Hello ${name}! Your birthday is ${day}.${month}.${year}` });
  console.log(records);
});

app.listen(5000, () => {
  console.log(`App listening at http://localhost:5000`);
});
