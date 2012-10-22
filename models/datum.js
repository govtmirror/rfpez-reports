var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  dataset_name: {type: String, index: true},
  data: {}
});

module.exports = DB.model('Datum', schema);