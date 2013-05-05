var passport = require('passport');

module.exports = function(app){
  app.get('/', function (req, res, next) {
    res.render('home');
  });

  app.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/'
  }));

  app.get('/login', function(req, res, next) {
    res.render('login');
  });

  app.get('/register', function(req, res, next) {
    res.render('register');
  });

  app.post('/register', function(req, res, next) {
    console.log(req);
    User.findOrCreate();
  });

  app.get('/logout', function(req, res, next){
    // req.logout()
    res.redirect('/');
  });
};