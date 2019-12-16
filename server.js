
const express = require("express");
var bodyParser = require("body-parser");
var util = require("util");
const app = express();
const port = 3000;
const dbUrl = 'mongodb://vrooziadmin:0vr00zi009@127.0.0.1:27017';
const mongoClient = require('mongodb').MongoClient;

mongoClient.connect('mongodb://vrooziadmin:0vr00zi009@127.0.0.1:27017', {useNewUrlParser: true}, function(err, client){
  console.log("connecting db");
  if(err) {
    throw err;
  } else {
    console.log("connected");
    app.post("/", (req, res) => {
      const database = client.db("vroozi");
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;
      var userCode  = req.body.userCode;
      findUser(firstName, lastName, userCode, database, res);

    });
  }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

function findUser(userfirstName, userlastName, userCode, db, res){
  db.collection("user").find({"firstName":userfirstName, "lastName":userlastName}).toArray(function(err, results) {
    if (results.length == 0) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.send("you are not authorized to login");
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/plain');
      res.send(JSON.stringify(results));
    }
  });
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
