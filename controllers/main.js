var Datum = require("../models/datum");

exports.index = function(req, res) {
  res.render('example');
}

exports.postDatum = function(req, res) {
  var datum = new Datum({
    dataset_name: req.params.dataset_name,
    data: req.body
  }).save();

  res.send("success!");
}