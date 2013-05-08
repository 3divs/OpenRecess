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

// TODO: make sure we add a +1 to the user's 10-digit phone number. 
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
    // possible collision alert!: this generates a random 3 digit code for every game:
    var temp = Math.floor(Math.random() * 1000);
    newGame = new Game({
      gameCode : temp,
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


  app.get('/send-sms', function(req, res) {
    Game.find({gameType: 'Cricket'}, function(err, results) {
      if (err)
        throw error;
      console.log(results[0].invitedPlayers);
      var numbersToSMS = results[0].invitedPlayers;
      var gameMessage = results[0].manager.display_name + ' wants you to play ' +
        results[0].gameType + " on " + results[0].gameTime + " at " +
        results[0].gameLocation + '. Reply ' + results[0].gameCode +
        '#y to join or ' + results[0].gameCode + '#n to sit this one out.';
        if (gameMessage.length < 144) {
          gameMessage =+ ' ~OpenRecess.com';
        }
      for (var i = 0; i < numbersToSMS.length; i++){
        twil.sendSMS(gameMessage, numbersToSMS[i].phone, twilioPhoneNumber, req, res);
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