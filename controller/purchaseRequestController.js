const express = require('express');
const app = express();
const router = express.Router();
var appconstants = require('../appconstants');

router.get("/", (req, res) => {
  console.log(req.body);
  getPurchaseRequest(req.body, res);
});
function getPurchaseRequest(body, res){
  appconstants.DATABASE.collection("purchase_requests").findOne({"orderNumber":body.orderNumber}, function(err, result) {
    if (result == null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({"status": 204}));
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/plain');
      var responseData = {
        "orderNumber": body.orderNumber,
        "status": 200,
        "requestStatus": result.status,
        "requester": result.requester
      };
      res.send(responseData);
    }
  });
}

router.put("/", (req, res) => {
  console.log(req.body);
  updatePurchaseRequest(req.body, res);
});
function updatePurchaseRequest(body, res){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/plain');
  appconstants.DATABASE.collection("purchase_requests").findOne({"orderNumber":body.orderNumber}, function(err, result) {
    if (result == null) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({"status": 204, "msg": "purchase request not found"}));
    } else {
      appconstants.DATABASE.collection("user").findOne({"firstName":body.firstName, "smartPin":body.smartPin}, function(err, result) {
        if (result != null) {
          var query = {"orderNumber":body.orderNumber};
          var updatedValues = {
            $set:
                {"status": "APPROVED",
                  "approvals" : [
                    {
                      "_id" : result.userId,
                      "name" : result.fullName,
                      "date" : new Date(),
                      "code" : "APPROVED",
                      "approved" : true,
                      "rejected" : false
                    }
                  ]}
          };
          appconstants.DATABASE.collection("purchase_requests").updateOne(query, updatedValues, function(err, updateResult) {
            if (err) throw err;
            console.log("request updated ");


            var responseData = {"orderNumber": body.orderNumber, "status": 200, "requestStatus": "APPROVED"};
            res.send(responseData);

          });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({"status": 204, "msg": "approver not found"}));
        }
      });
    }
  });
}

module.exports = router;