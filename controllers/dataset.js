var Datum = require("../models/datum");

exports.index = function(req, res) {
  Datum.collection.distinct("dataset_name", function(err, results){
    res.render("dataset/index", {datasets: results});
  });
}

exports.show = function(req, res) {
  Datum.all_keys(function(keys){
    Datum.find({dataset_name: req.params.dataset_name}, function(err, results){
      res.render("dataset/show", {
        data: results,
        dataset_name: req.params.dataset_name,
        keys: keys
      });
    });
  })
}

exports.csv = function(req, res) {
  Datum.all_keys(function(keys){
    Datum.find({dataset_name: req.params.dataset_name}, function(err, results){
      var csvString;

      // Column names
      csvString += keys.join(",") + ",created_at,\n";

      // Rows
      for(result in results) {
        for (key in keys) csvString += results[result].data[keys[key]] + ",";
        csvString += results[result].created_at + ",";
        csvString += "\n";
      }

      res.header('Content-type', 'text/csv');
      res.header('Content-disposition', 'attachment;filename='+req.params.dataset_name+'.csv');
      res.send(csvString);
    });
  })
}

exports.postDatum = function(req, res) {
  var datum = new Datum({
    dataset_name: req.params.dataset_name,
    data: req.body
  }).save();

  res.send("success!");
}