
const express = require("express");
var bodyParser = require("body-parser");
var util = require("util");
var database;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 9001;
const dbUrl = 'mongodb://vrooziadmin:0vr00zi009@127.0.0.1:27017';
const mongoClient = require('mongodb').MongoClient;
mongoClient.connect(dbUrl, {useNewUrlParser: true}, function(err, client){
  console.log("connecting db");
  if(err) {
    throw err;
  } else {
    console.log("connected");
    database = client.db("vroozi");
  }
})

var appconstants = require('./appconstants');

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/", (req, res) => {
  var intent = req.body.queryResult.intent.displayName;
  console.log("intent:" + intent);
  if (intent==appconstants.USER_AUTHENTICATION) {
    findUser(req.body.firstName, req.body.pin, res);
  } else if (intent==appconstants.CREATE_REQUEST) {
    createRequest(req, res);
  } else {
    console.log("no intent matched");
    res.send("no intent matched.");
  }
});


function findUser(firstName, pin, res){
  database.collection("user").find({"firstName":firstName, "pin":pin}).toArray(function(err, results) {
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

function createRequest(req, res){
  database.collection("user").find({"firstName":firstName, "pin":pin}).toArray(function(err, results) {
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
