var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  api_key: {type: String, index: true},
  name: String
});

schema.pre('save', function (next) {
  var application = this;
  if (!application.api_key) {
    require('crypto').randomBytes(36, function(ex, buf) {
      application.api_key = buf.toString('hex');
      next();
    });
  } else {
    next();
  }
});

module.exports = DB.model('Application', schema);