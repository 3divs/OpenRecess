var passport = require('passport'),
    twil = require('../src/twilio.js'),
    mongoose = require('mongoose'),
    users = require('./users.js');

module.exports = function(app){
  var db = app.set('db');
  var User = db.model('User');
  var Game = db.model('Game');
  var Message = db.model('Message');

  app.get('/', function (req, res, next) {
    res.render('home');
  });

  /*******************
  *** LOGIN/LOGOUT ***
  *******************/

  app.post('/login', passport.authenticate('local'), function(req, res) {
    var user = {};
    user.email = req.user.email;
    user.phone = req.user.phone;
    user.display_name = req.user.display_name;
    res.json(user);
  });

  app.get('/login', function(req, res, next) {
    res.render('login');
  });

  app.get('/logout', function(req, res, next) {
    req.logout();
    res.json(200, 'Logged Out');
  });

  /***********
  *** USER ***
  ***********/

  app.get('/users/:id', users.findById);
  app.get('/users', users.findAll);
  app.post('/users', users.createUser);
  app.put('/users', users.updateUser);
  app.delete('/users/:id', users.deleteUser);

  app.get('/user/current', function(req, res ,next){
    if(req.user) {
      // Return subset of fields
      var user = {};
      user.email = req.user.email;
      user.phone = req.user.phone;
      user.display_name = req.user.display_name;
      return res.json(user);
    }
    else return res.json();
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
      invitedPlayers: req.body.playerArray.split(','),
      manager: req.user._id,
      gameCode : temp,
      gameDate : req.body.gameDate,
      gameTime : req.body.gameTime,
      gameName : req.body.gameName,
      gameType : req.body.gameType,
      coord: {lat: req.body.latitude, lon: req.body.longitude},
      gameLocation: req.body.gameLocation,
      minimumPlayers : req.body.minimumPlayers,
      playerLimit: req.body.playerLimit
    });
    newGame.save();
    res.redirect('/games');
  });

  app.get('/games', function(req, res, next) {
    // TODO: implement error handling
    console.log(req.xhr);

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
          res.json(results);
        }
      });
    });
  });

var twilioPhoneNumber = '+14159928245';
//add the actual id to this URL and later request params.id in Games.findById(params.id)
// make sure to authenticate access to this page for the Manager only...
  app.get('/send-sms/:id', function(req, res) {
    if(!req.user) return res.send(401);
    Game.findOne({ _id: req.params.id, manager: req.user._id }, function(err, game) {
      if (err)
        throw error; // we need a 404 error page to serve if game and user ID don't exist...
      if(!game) return res.send(404);
      console.log('game', game);
      console.log('phone numbers', game.invitedPlayers);
      var gameMessage = game.manager + ' wants you to play ' +
        game.gameType + " on " + game.gameTime + " at " +
        game.gameLocation + '. Reply ' + game.gameCode +
        '#y to join or ' + game.gameCode + '#n to sit this one out.';
        if (gameMessage.length < 144) {
          gameMessage = gameMessage + ' ~OpenRecess.com';
        }
      for (var i = 0; i < game.invitedPlayers.length; i++){
        console.log(gameMessage, game.invitedPlayers[i], twilioPhoneNumber);
        twil.sendSMS(gameMessage, game.invitedPlayers[i], twilioPhoneNumber, req, res);
        // Add to message database a item with requester, number sent to, message, messageSID, event
      }
    });
  });

  app.post('/retrieve-sms', twil.retrieveSMS);

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