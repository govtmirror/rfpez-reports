exports.afterGithub = function(req, res) {
  res.redirect('/');
}

exports.login = function(req, res) {
  res.render("auth/login");
}

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}