const express = require('express');
const app = express();
const router = express.Router();
var appconstants = require('../appconstants');

router.post("/authenticateUser", (req, res) => {
  console.log(req.body);
  findUser(req.body.firstName, req.body.smartPin, res);
});


function findUser(firstName, smartPin, res){
  appconstants.DATABASE.collection("user").findOne({"firstName":firstName, "smartPin":smartPin}, function(err, result) {
    if (result == null) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.send("you are not authorized to login");
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/plain');
      res.send(JSON.stringify(result.userId));
    }
  });
}

module.exports = router;