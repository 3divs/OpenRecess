var User = require('../models/user.js');

module.exports = {
  createUser: function(req, res, next) {
    console.log('Attempting to create new user: ', req.body.email);
    newUser = new User({
      email: req.body.email,
      display_name: req.body.display_name,
      phone: '+1' + req.body.phone,
      password: req.body.password
    });
    newUser.save(function(err, results) {
      if(err) {
        console.log(err);
        if(err.code === 11000 || err.code === 11001)
          res.json(400, 'Account already exists. Please choose a different email address.');
        else
          res.json(400, err.err);
      }
      else
        res.json(200, 'Success!');
    });
  },

  updateUser: function(req, res, next) {
    console.log('Update user');
    res.json(200, 'Update stub');
  },

  deleteUser: function(req, res, next) {
    res.json(200, 'Delete stub');
  },

  findById: function(req, res, next) {
    res.json(200, 'GetUser stub');
  },

  findAll: function(req, res, next) {
    res.json(200, 'GetAllUser stub');
  }
};
