var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  dataset_name: {type: String, index: true},
  data: {},
  created_at: String
});

schema.statics.all_keys = function (cb) {
  this.collection.mapReduce(
    function() { for (var key in this.data) { emit(key, null); } },
    function(key, stuff) { return null; },
    { out: { inline: 1 } },
    function(err, res){
      var keys = [];
      for (key in res) {
        keys.push(res[key]._id);
      }
      cb(keys);
    }
  );
};

schema.pre('save', function (next) {
  var datum = this;
  if (!this.created_at) this.created_at = (new Date()).getTime();
  next();
});

module.exports = DB.model('Datum', schema);