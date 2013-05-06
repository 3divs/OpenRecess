
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    everyauth = require('./node_modules/everyauth'),
    exphbs  = require('express3-handlebars');
    // mongoose = require('express-mongoose');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Add everyauth middleware
app.use(everyauth.middleware());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res, next) {
  res.render('home');
});

app.get('/users', user.list);
app.get('/send-sms', routes.sendSMS);
app.post('http://fast-tundra-5165.herokuapp.com', function(req, res) {
  var msg = req.body.Body;
  var from = req.body.From;
  console.log(msg);
  console.log(from);
});
// app.get('/retrieve-sms', routes.retrieveSMS);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
