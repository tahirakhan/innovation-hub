
const express = require("express");
var bodyParser = require("body-parser");
var util = require("util");
const app = express();
<<<<<<< HEAD
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
=======
const port = 9001;
>>>>>>> 27560a7771cb7f3d56c3930f82e5f9ccdbb340e7

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

<<<<<<< HEAD
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
=======
app.post("/", (req, res) => {
  console.log(req.body);

  var itemName = req.body.itemName;

  res.send(req.body);
});
>>>>>>> 27560a7771cb7f3d56c3930f82e5f9ccdbb340e7

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
