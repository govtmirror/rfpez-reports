var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  is_admin: Boolean,
  dataset_permissions: Array,
  email: String,
  token: String,
  provider: String
});

schema.index({provider: 1, token: 1}, {unique: true});

module.exports = DB.model('User', schema);