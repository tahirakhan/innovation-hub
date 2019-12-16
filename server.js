const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/", (req, res) => {
  console.log("Post Request received");
  res.send(req.body);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
