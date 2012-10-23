var passport = require('passport');

exports.auth = function(req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

exports.loginGithub = function() {
  return passport.authenticate('github', { failureRedirect: '/login' });
}