var mongoose = require('mongoose');
var Datum = require('./datum');

var schema = new mongoose.Schema({
  is_admin: Boolean,
  dataset_permissions: Array,
  username: String,
  token: String,
  provider: String,
  api_key: {type: String, index: true}
});

schema.index({provider: 1, token: 1}, {unique: true});

schema.methods.my_datasets = function(cb) {
  var user = this;
  Datum.collection.distinct("dataset_name", function(err, results){
    var datasets = [];
    for (var i = 0, len = user.dataset_permissions.length; i < len; i++) {
      if (results.indexOf(user.dataset_permissions[i]) === -1) datasets.push(user.dataset_permissions[i]);
    }
    for (i in results) {
      if (user.dataset_permissions.indexOf(results[i]) !== -1) datasets.push(results[i]);
    }
    cb(datasets);
  });
}

schema.statics.dataset_exists = function (dataset_name, cb) {
  var User = this;
  Datum.findOne({dataset_name: dataset_name}, function(err, result){
    if (result) return cb(true);
    User.findOne({dataset_permissions: dataset_name}, function (err, result){
      if (result) return cb(true);
      return cb(false);
    });
  });
};

schema.pre('save', function (next) {
  var use = this;
  if (!use.api_key) {
    require('crypto').randomBytes(18, function(ex, buf) {
      use.api_key = buf.toString('hex');
      next();
    });
  } else {
    next();
  }
});

module.exports = DB.model('User', schema);