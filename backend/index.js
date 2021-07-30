const express = require("express");
const app = express();
const cors = require("cors");

let records = []

/*[
  { name: 'Giray', day: '19', month: '06', year: '1992' },
  { name: 'Yağız', day: '21', month: '06', year: '1992' }
]
*/

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/birthday", function(req, res){
    res.json(records);
});

app.get("/birthday/month/:month", function(req, res){
    const check = req.params.month;
    const array = [];
    for(let i=0;i<records.length;i++){
        if(records[i].month === check)
        array.push(records[i]);
    }
    res.json(array);
});

app.get("/birthday/today", function(req, res){
    const today = new Date();
    const array = [];
    console.log(today.getMonth());
    for(let i=0;i<records.length;i++){
        if(records[i].month === (today.getMonth()+1))
        array.push(records[i]);
    }
    res.json(array);
});

app.get("/birthday/:name", function(req, res){
    const check = req.params.name;
    for(let i=0;i<records.length;i++){
        if(records[i].name === check)
        res.json(records[i]);
    }

});

//Upcoming: List the birthdays that are in current month but only the non-past dates



app.post("/birthday", function(req,res){
    const name = req.body.name;
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;
    let record ={
        name: name,
        day: day,
        month: month,
        year: year    
    }
    records.push(record)
    res.json({bday:`Hello ${name}! Your birthday is ${day}.${month}.${year}`});
    console.log(records);
})



app.listen(5000, () => {
    console.log(`App listening at http://localhost:5000`);
  });