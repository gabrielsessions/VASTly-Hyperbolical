var express = require("express");
var router = express.Router();

const fs = require("fs");
const csvParser = require("csv-parser");

const result = [];

router.get("/", function (req, res, next) {
  fs.createReadStream("./data/Lekagul Sensor Data.csv")
    .pipe(csvParser())
    .on("data", (data) => {
      result.push(data);
    })
    .on("end", () => {
      res.send(result);
    });
  
});

module.exports = router;
