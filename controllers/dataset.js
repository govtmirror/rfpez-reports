var Datum = require("../models/datum");
var User = require("../models/user");

exports.index = function(req, res) {
  req.user.my_datasets(function(datasets){
    res.render("dataset/index", {datasets: datasets});
  });
}

exports.create = function(req, res) {
  User.dataset_exists(req.body.name, function(dataset_exists){
    if (!req.body.name.replace(/\s/g,"")) return res.redirect("datasets"); // name can't be blank
    if (dataset_exists) return res.redirect("datasets"); // already exists

    req.user.dataset_permissions.push(req.body.name);
    req.user.save(function(err){
      if (err) console.log(err);
      res.redirect("datasets");
    });
  });
}

exports.show = function(req, res) {
  Datum.all_keys(req.params.dataset_name, function(keys){
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
  Datum.all_keys(req.params.dataset_name, function(keys){
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