const express = require('express');
const app = express();
const router = express.Router();
var appconstants = require('../appconstants');

router.get("/", (req, res) => {
  console.log(req.body);
  lastFiveSuppliers(req, res);
});


function lastFiveSuppliers(req, res){
  appconstants.DATABASE.collection("supplier").find({active: true, unitId: "2"}).sort({_id: -1}).limit(5).toArray(function (err, result) {
    if (result == null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({"status": 204}));
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/plain');

      var resultLength = result.length;
      var resultData = [];
      for (var i = 0; i < resultLength; i++) {
        resultData.push(result[i].companyName);
      }
      res.send(JSON.stringify({"status": 200, "result": resultData}));
    }
  });
}

module.exports = router;