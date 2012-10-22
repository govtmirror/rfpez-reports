var Application = require("../models/application");

exports.index = function(req, res) {
  // my applications
  res.render("application/index");
}

exports.new = function(req, res) {
  // do stuff
  res.render("application/new")
}

exports.create = function(req, res) {
  // do stuff
  Application.findOne({name: req.body.name}, function(err, application){
    if (!application) {
      var application = new Application({name: req.body.name});
      application.save();
      res.render("application/new", {flash: {success: "Application created."}});
    } else {
      res.render("application/new", {flash: {error: "An application with that name already exists."}});
    }
  });
}