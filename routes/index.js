var passport = require('passport'),
    twil = require('../src/twilio.js'),
    mongoose = require('mongoose');

module.exports = function(app){
  var db = app.set('db');
  var User = db.model('User');
  var Game = db.model('Game');
  var Message = db.model('Message');

  app.get('/', function (req, res, next) {
    res.render('home');
  });

  app.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login'
  }));

  app.get('/login', function(req, res, next) {
    res.render('login');
  });

  app.get('/register', function(req, res, next) {
    res.render('register');
  });

  app.post('/register', function(req, res, next) {
    console.log(req.body);
    newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save(function(err, results) {
      if(err)
        console.log(err);
      else
        res.redirect('/');
    });
  });

  app.get('/logout', function(req, res, next){
    // req.logout()
    res.redirect('/');
  });

  // app.get('/game', ensureAuthenticated, function(req, res, next) {
  app.get('/game', function(req, res, next) {
    // if(!req.isAuthenticated()) res.redirect('/login');
    res.render('game');
  });

  app.post('/game', function(req, res, next) {
    newGame = new Game({
      gameName : req.body.gameName,
      gameType : req.body.gameType,
      gameTime : req.body.gameTime,
      minimumPlayers : req.body.minimumPlayers,
      players: req.body.players,
      playerLimit: req.body.playerLimit,
      gameLocation: req.body.gameLocation
    });
    newGame.save();
    res.redirect('/games');
  });

  app.get('/games', function(req, res, next) {
    // TODO: implement error handling
    console.log(req.xhr);
    console.log(req.get('Content-Type'));

    // Return all games
    Game.find({}, function(err, results) {
      // Respond with either HTML or JSON depending on request
      res.format({
        html: function() {
          var context = {};
          context['Games'] = results;
          console.log('html response');
          res.render('games', context);
        },
        json: function() {
          console.log('json response');
          res.send(results);
        }
      });
    });
  });


  app.get('/send-sms', function(req, res, Requester) {
    Game.find({gameType: 'Cricket'}, function(err, results) {
      if (err)
        throw error;
      console.log(results[0].players);
      var numbersToSMS = results[0].players;
      var gameMessage = 'You down to play ' + results[0].gameType + " on " + results[0].gameTime + " at " + results[0].gameLocation + '?  Just reply #yes or #no to this number.';
      for (var i = 0; i < numbersToSMS.length; i++){
        twil.sendSMS(gameMessage, numbersToSMS[i], twilioPhoneNumber, req, res);
        // Add to message database a item with requester, number sent to, message, messageSID, event
      }
    });
  });

  app.post('/retrieve-sms', function(req, res) {
    twil.retrieveSMS();  // we gotta do more here...
  });

  app.post('/retrieve-sms/user', function(req, res) {
    twil.retrieveSMS(userPhoneNumber);
  });



};

function ensureAuthenticated(req, res, next) {
  console.log('ensureAuthenticated called');
  console.log('auth - ', req.isAuthenticated());
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}