const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const port = 443;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/", (req, res) => {
  console.log(req.body);

  var itemName = req.body.itemName;

  res.send(req.body);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
