var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  is_admin: Boolean,
  dataset_permissions: Array,
  email: {type: String, index: true},
  token: {type: String, index: true}
});

module.exports = DB.model('User', schema);