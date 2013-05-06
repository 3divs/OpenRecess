var passport = require('passport');

module.exports = function(app){
  var db = app.set('db');
  var User = db.model('User');

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
};