const express = require('express');
const app = express();
const router = express.Router();
var appconstants = require('../appconstants');

router.post("/", (req, res) => {
  console.log(req.body);
  getPurchaseRequest(req.body, res);
});
function getPurchaseRequest(body, res){
  appconstants.DATABASE.collection("purchase_requests").findOne({"orderNumber": { "$regex": body.orderNumber+"\\b" } }, function(err, result) {
    if (result == null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      console.log("invalid orderNumber");
      res.send(JSON.stringify({"status": 204, "msg": "invalid orderNumber"}));
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/plain');
      var responseData = {
        "orderNumber": body.orderNumber,
        "status": 200,
        "requestStatus": result.status,
        "requester": result.requester,
        "total": "$"+result.totalAmount,
        "requestName": result.name
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
  appconstants.DATABASE.collection("purchase_requests").findOne({"orderNumber":{ "$regex": body.orderNumber+"\\b" } }, function(err, purchaseRequest) {
    if (purchaseRequest == null) {
      console.log("invalid orderNumber");
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({"status": 204, "msg": "invalid orderNumber"}));
    } else {
      appconstants.DATABASE.collection("user").findOne({"firstName":body.firstName, "smartPin":body.smartPin}, function(err, result) {
        if (result != null) {
          var query = {"orderNumber":purchaseRequest.orderNumber};
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
            var responseData = {
              "orderNumber": body.orderNumber,
              "status": 200,
              "requestStatus": "APPROVED",
              "requester": purchaseRequest.requester,
              "total": "$"+purchaseRequest.totalAmount,
              "requestName": purchaseRequest.name
            };
            console.log("purchase request updated successfully");
            res.send(responseData);
          });
        } else {
          res.setHeader('Content-Type', 'application/json');
          console.log("invalid approver");
          res.send(JSON.stringify({"status": 204, "msg": "invalid approver"}));
        }
      });
    }
  });
}

module.exports = router;