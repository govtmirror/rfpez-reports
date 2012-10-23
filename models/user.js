var mongoose = require('mongoose');
var Datum = require('./datum');

var schema = new mongoose.Schema({
  is_admin: Boolean,
  dataset_permissions: Array,
  username: String,
  token: String,
  provider: String
});

schema.index({provider: 1, token: 1}, {unique: true});

schema.methods.my_datasets = function(cb) {
  var user = this;
  Datum.collection.distinct("dataset_name", function(err, results){
    var datasets = [];
    for (i in results) {
      if (user.dataset_permissions.indexOf(results[i]) !== -1) datasets.push(results[i]);
    }
    cb(datasets);
  });
}

module.exports = DB.model('User', schema);