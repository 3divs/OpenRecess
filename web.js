
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    everyauth = require('./node_modules/everyauth'),
    exphbs  = require('express3-handlebars'),
    mongoose = require('mongoose');

// Connect to mongoose database and create object schemas
mongoose.connect('mongodb://localhost:17017/openRecess');
var User = require('./models/user.js')(mongoose);

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

/* Every Auth test code */
everyauth.everymodule.findUserById(function() {
  console.log('everyauth');
});

everyauth.password
  .getLoginPath('/login')
  .postLoginPath('/login')
  .loginView('login')
  .authenticate(function(login, password) {
    console.log('authenticate called');
  })
  .loginSuccessRedirect('/')
  .getRegisterPath('/register')
  .postRegisterPath('/register')
  .registerView('register')
  .validateRegistration(function(newUserAttributes) {
    console.log('validate registration');
  })
  .registerUser(function(newUserAttributes) {
    console.log('register new user');
  })
  .registerSuccessRedirect('/');

// everyauth.password.

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());

// Add everyauth middleware
app.set(express.session({secret: 'secret'}));
app.use(everyauth.middleware());

app.use(express.favicon());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res, next) {
  console.log('user: ', req.user);
  res.render('home');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
