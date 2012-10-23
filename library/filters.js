var passport = require('passport');

exports.auth = function() {
  return passport.authenticate('github', { failureRedirect: '/login' });
}