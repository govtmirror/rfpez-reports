var User = require('../models/user');

exports.typeahead = function(req, res) {
  var query = User.find({$and: [{username: new RegExp(req.param('query'), 'i')}, {username: {$ne: req.user.username}}]}).select('username');

  query.exec(function(err, results){
    results = results.map(function(result){ return result.username; });
    res.send(results);
  });
}