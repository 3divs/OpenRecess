var passport = require('passport');

module.exports = function(app){
  var db = app.set('db');
  var User = db.model('User');
  var Game = db.model('Game');

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
    newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save();
    res.redirect('/');
  });

  app.get('/logout', function(req, res, next){
    // req.logout()
    res.redirect('/');
  });

  app.get('/game', function(req, res, next) {
    res.render('game');
  });

  app.post('/game', function(req, res, next) {
    var players = [7816401203, 6502699118];   // TODO: change from static
    newGame = new Game({
      gameName : req.body.gameName,
      gameType : req.body.gameType,
      gameTime : req.body.gameTime,
      minimumPlayers : req.body.minimumPlayers,
      players: players
    });
    newGame.save();
    res.redirect('/games');
  });

  app.get('/games', function(req, res, next) {
    var context = {};
    Game.find({}, function(err, results) {
      context['Games'] = results;
      res.render('games', context);
    });
  });
};