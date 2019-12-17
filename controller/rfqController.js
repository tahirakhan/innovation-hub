const express = require('express');
const app = express();
const router = express.Router();
var fs = require("fs");
var appconstants = require('../appconstants');

router.post("/", (req, res) => {
    console.log(req.body);
    createRfq(res, req.body);
  });

  function createRfq(res, requestBody) {
    var contents = fs.readFileSync("./templates/rfq_form_template.json");
    var jsonContent = JSON.parse(contents);
    jsonContent.suppliers = [];
    var supplier = findSupplier(requestBody.uniqueSupplierId);
    supplier.then(function(value) {
      jsonContent.suppliers.push(value);
    }).catch(function () {
      res.send("Supllier Not Found");
    }).then(function(){
      var requester =  findUser(requestBody.userId);
      requester.then(function(value) {
        jsonContent.requesterId = value.userId;
        jsonContent.unitId = value.unitId;
        jsonContent.requesterName = value.fullName;
        jsonContent.requesterEmail = value.email;
        jsonContent.createdDate = new Date();
        jsonContent.lastUpdatedDate = new Date();
        jsonContent.submittedDate = new Date();
        
        var nextRfqSequence = getNextRfqNumber();
        nextRfqSequence.then(function(value) {
          var quoteItem = jsonContent.quoteItems[0]; 
          quoteItem.description = requestBody.itemDescription;
          quoteItem.qty = requestBody.itemQty;
          quoteItem.deliveryDate = new Date(requestBody.deliveryDate);
          // console.log(JSON.stringify(quoteItem));
          jsonContent.requestNumber = ""+value.value;
          jsonContent.requestName = "RF"+ value.value;
          appconstants.DATABASE.collection("quote_request_forms").insertOne(jsonContent, function(err, res) {
            if (err) throw err;
            console.log("RFQ document inserted");
          });
          res.send("RFQ document Created And Document Number is " + value.value);
          // res.send(jsonContent)          
        })
      }).catch(function () {
        res.send("User Not Found");
      })
    });
  }

function findUser(userId) {
  return new Promise(function(resolve, reject) {
    appconstants.DATABASE.collection("user").findOne({"userId" : userId}, function(err, result) {
      if (result != null) {
       resolve(result);
      } else {
        reject(err);
      }
    });
  });
} 

function findSupplier(uniqueSupplierId) {
  return new Promise(function(resolve, reject) {
    appconstants.DATABASE.collection("supplier").findOne({"uniqueSupplierId" : uniqueSupplierId}, function(err, result) {
      if (result != null) {
       resolve(result);
      } else {
        reject(err);
      }
    });
  });
}

function getNextRfqNumber() {
  return new Promise(function(resolve, reject) {
    appconstants.DATABASE.collection("seq_collection").findOne({"name" : "seq_quick_rfx_form_2"}, function(err, result) {
      if (result != null) {
        var updateSequence = result;
        var nextNumber = updateSequence.value + 1;
        updateSequence.value = nextNumber;
        var myquery = { "name" : "seq_quick_rfx_form_2" };
        var newvalues = { $set: {"value": nextNumber} };
        appconstants.DATABASE.collection("seq_collection").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("seq_quick_rfx_form_2 updated ");
          });
          resolve(updateSequence);
      } 
    });
  });
}

module.exports = router;