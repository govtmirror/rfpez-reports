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
  res.render("dataset/show", {
    data: Datum.find({dataset_name: req.params.dataset_name}),
    dataset_name: req.params.dataset_name,
    collaborators: Datum.collaborators_for_dataset(req.params.dataset_name),
    keys: Datum.all_keys(req.params.dataset_name)
  });
}

exports.csv = function(req, res) {
  Datum.all_keys(req.params.dataset_name, function(keys){
    Datum.find({dataset_name: req.params.dataset_name}, function(err, results){
      var csvString = "";

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
  var api_key = req.query.api_key;

  User.findOne({api_key: api_key, dataset_permissions: req.params.dataset_name}, function(err, user){
    if (!api_key || api_key == "" || !user) return res.send("not authorized");

    var datum = new Datum({
      dataset_name: req.params.dataset_name,
      data: req.body
    });

    datum.save(function(err){
      res.send("success!");
    });
  });
}

exports.addCollaborator = function(req, res) {
  User.findOne({username: req.param('username')}, function(err, user){
    if (!user) return res.send({status: "error", message: "User not found."});
    if (user.dataset_permissions.indexOf(req.params.dataset_name) !== -1)
      return res.send({status: "error", message: "User already has permission."});

    user.dataset_permissions.push(req.params.dataset_name);
    user.save(function(err){
      return res.send({status: "success"});
    });
  });
}