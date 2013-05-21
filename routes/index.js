var passport = require('passport'),
    twil = require('../src/twilio.js'),
    mongoose = require('mongoose'),
    users = require('./users.js'),
    moment = require('moment'),
    config = require('../config/config.js'),
    teams = require('./teams.js');

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

  /***********
  *** TEAM ***
  ***********/

  app.get('/teams', teams.findTeams);
  app.put('/teams', teams.updateTeam);
  app.delete('/teams', teams.deleteTeam);

  /***********
  *** GAME ***
  ***********/

  // app.get('/game', ensureAuthenticated, function(req, res, next) {
  app.get('/game', function(req, res, next) {
    // if(!req.isAuthenticated()) res.redirect('/login');
    res.render('game');
  });

  app.post('/game', function(req, res, next) {
    // possible collision alert!: this generates a random 3 digit code for every game:
    var temp = Math.floor(Math.random() * 1000);
    console.log(req.body);
    newGame = new Game({
      invitedPlayers: req.body.playerArray.split(','),
      manager: req.user._id,
      gameCode : temp,
      gameDate : req.body.gameDate,
      gameTime : req.body.gameTime,
      gameName : req.body.gameName,
      gameType : req.body.gameType,
      coord: {lat: req.body.latitude, lon: req.body.longitude},
      minimumPlayers : req.body.minimumPlayers,
      playerLimit: req.body.playerLimit
    });
    newGame.save(function(err, data) {
      if(err)
        res.json(403, {err: 'Invalid params'});
      else
        res.json(200, {gameId: data._id});
    });
  });

  app.put('/game', function(req, res, next){
    console.log('the req', req.body);
    var code = req.body.code;
    var digits = req.body.phone;
    Game.findOneAndUpdate(
    {
      gameCode : code,
      confirmedPlayers : { $nin: [digits] }
    },
    {
      $pull : { invitedPlayers : digits },
      $addToSet : { confirmedPlayers : digits },
      $inc : { confirmedPlayersCount : 1 }
    },
    function(err, thisGame){
      if(err) {
        return 'no such game found';
      } else {
        console.log(thisGame);
        twil.sendSMS('Game on for ' + thisGame.gameType + '#' + thisGame.gameCode + ' on ' + moment(thisGame.gameDate).format('LL') + ' at ' + thisGame.gameTime + '. Stay tuned for more text message updates.', digits, twilioPhoneNumber);
      }
    });
    res.json(200, 'Done and done');
  });

  app.get('/games', function(req, res, next) {
    // TODO: implement error handling
    console.log('Getting All Games');

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
          console.log('json response - ', results.length);
          res.json(results);
        }
      });
    });
  });

var twilioPhoneNumber = config.twilioNumber;
//add the actual id to this URL and later request params.id in Games.findById(params.id)
// make sure to authenticate access to this page for the Manager only...
  app.get('/send-sms/:id', function(req, res) {
    console.log(req.params);
    if(!req.user) return res.json(401, 'No User');
    Game.findOne({ _id: req.params.id, }, function(err, game) {
      if (err)
        throw error; // we need a 404 error page to serve if game and user ID don't exist...
      if(!game) return res.json(404, 'No Game');
      User.findOne({ _id: req.user._id}, function(err, manager){
        console.log('game', game);
        if (err)
          throw error; // we need a 404 error page to serve if game and user ID don't exist...
        if(!manager) return res.json(404, 'No Manager');
        var gameMessage = manager.display_name + ' wants you to play ' +
          game.gameType + " at " + game.gameTime + ' on ' + moment(game.gameDate).format('LL') + '. Reply ' + game.gameCode +
          '#y to join or ' + game.gameCode + '#n to sit this one out.';
          if (gameMessage.length < 144) {
            gameMessage = gameMessage + ' ~OpenRecess.com';
          }
        for (var i = 0; i < game.invitedPlayers.length; i++){
          console.log(gameMessage, game.invitedPlayers[i], twilioPhoneNumber);
          twil.sendSMS(gameMessage, game.invitedPlayers[i], twilioPhoneNumber, req, res);
          // Add to message database a item with requester, number sent to, message, messageSID, event
      }
      res.json(200, 'Success');
      });
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