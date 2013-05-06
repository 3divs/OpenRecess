
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    exphbs  = require('express3-handlebars'),
    mongoose = require('mongoose');

// Connect to mongoose database and create object schemas
mongoose.connect('mongodb://localhost:17017/openRecess');
var User = require('./models/user.js')(mongoose);

// Setup express server
var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('port', process.env.PORT || 5000);
app.set('db', mongoose);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.set(express.session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.favicon());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Setup passport config
passport.use(new LocalStrategy(function(username, password, done){
  console.log('TEST - ', username, password);
  // User.findOne(username, password, function(err, user, msg){
    // console.log('User login - ', user, msg);
    // done(err, user, msg);
    return done(null, {username: 'Mark', _id: 123});
  // });
}));

passport.serializeUser(function(user, done) {
  console.log('User serialize - ', user);
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  console.log('User deserialize - ', _id);
  User.findById(_id, done);
});

require('./routes')(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
