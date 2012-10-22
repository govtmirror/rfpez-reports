var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  api_key: {type: String, index: true},
  name: String
});

module.exports = DB.model('Application', schema);