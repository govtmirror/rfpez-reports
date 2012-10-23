
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy;

global.DB = mongoose.createConnection('localhost', 'rfpez-reports');
var User = require('./models/user');

// Configuration
try {
    var configJSON = fs.readFileSync(__dirname + "/config.json");
    var config = JSON.parse(configJSON.toString());
} catch(e) {
    console.error("File config.json not found or is invalid.  Try: `cp config.json.sample config.json`");
    process.exit(1);
}

passport.use(new GitHubStrategy({
    clientID: "a85764447741acee227e",
    clientSecret: "1bba6b8e6e97656e776b643c854e28b92ba3a38b",
    callbackURL: "http://localhost:"+config.port+"/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({token: profile.id, provider: "github"}, function (err, user) {
      if (!user) {
        var user = new User({token: profile.id, provider: "github", username: profile.username});
        user.save()
      }
      return done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

var app = express();
app.set("trust proxy", true);

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.configure(function(){
  app.set('port', process.env.PORT || config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
  });


  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes.init(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
