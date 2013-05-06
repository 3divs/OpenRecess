var mongoose = require('mongoose');
var __ = require('underscore');
mongoose.connect('mongodb://localhost:17017/openRecessTest');
var User = require('../models/user.js')(mongoose);
var user;

describe('User', function() {
  // beforeEach(function() {
  //   email = 'test@test.com';
  //   phone = 1234567890;
  //   password = 'password';
  //   user = new User({email: email, phone: phone, password: password});
  //   user.save();
  // });

  describe('validation', function() {
    var email, phone, password;
    beforeEach(function() {
      email = 'test@test.com';
      phone = 1234567890;
      password = 'password';
    });

    afterEach(function() {
      User.remove(function() {});
    });

    it('should not error for valid phone number, email, and password', function() {
      user = new User({email: email, phone: phone, password: password});
      user.save(function(err) {
        expect(err).not.toBeDefined();
      });
    });

    it('should error on invalid phone number', function() {
      var invalidVals = [123, 1234214, 12345678901];
      __.each(invalidVals, function(val) {
        user = new User({email: email, phone: val, password: password});
        user.save(function(err) {
          expect(err).toBeDefined();
        });
      });
    });

    it('should error on empty password', function() {
      password = '';
      user = new User({email: email, phone: phone, password: password});
      user.save(function(err) {
        expect(err).toBeDefined();
      });
    });

    it('should error on invalid email', function() {
      var invalidVals = ['asdf', 'asdf@asdf', 'asdf@asdf.asdsdff', ''];
      __.each(invalidVals, function(val) {
        user = new User({email: val, phone: phone, password: password});
        user.save(function(err) {
          expect(err).toBeDefined();
        });
      });
    });
  });
});