const express = require("express");
var bodyParser = require("body-parser");
var util = require("util");

var appconstants = require('./appconstants');
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
    appconstants.DATABASE = client.db("vroozi");
  }
})
//declare controllers and binding here
//FAQ Controller
const faqController = require('./controller/faqController');
app.use('/faq',faqController);
const userController = require('./controller/userController');
app.use('/user',userController);
const supplierController = require('./controller/supplierController');
app.use('/supplier',supplierController);
const rfqController = require('./controller/rfqController');
app.use('/rfq', rfqController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
