var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  dataset_name: {type: String, index: true},
  data: {},
  created_at: {type: Date, default: Date.now}
});

schema.statics.all_keys = function (dataset_name, cb) {
  var promise = new mongoose.Promise();

  this.collection.mapReduce(
    function() { for (var key in this.data) { emit(key, null); } },
    function(key, stuff) { return null; },
    { out: { inline: 1 }, query: {dataset_name: dataset_name} },
    function(err, res){
      var keys = [];
      for (key in res) {
        keys.push(res[key]._id);
      }
      if (cb) return cb(keys);
      promise.complete(keys);
    }
  );

  return promise;
};

schema.statics.collaborators_for_dataset = function (dataset_name) {
  var User = require('./user');
  return User.find({dataset_permissions: dataset_name});
}

module.exports = DB.model('Datum', schema);