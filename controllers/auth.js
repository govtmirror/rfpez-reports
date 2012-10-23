exports.github = function(req, res) {
  res.redirect('/');
}

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}