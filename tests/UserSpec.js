var mongoose = require('mongoose');
var __ = require('underscore');
mongoose.connect('mongodb://localhost:17017/openRecessTest');
var User = require('../models/user.js')(mongoose);
var user;

describe('User', function() {

  it('has functions: createUser, validateUser, updateUser, findByEmail', function() {
    expect(User.createUser).toEqual(jasmine.any(Function));
    expect(User.validateUser).toEqual(jasmine.any(Function));
    expect(User.updateUser).toEqual(jasmine.any(Function));
    expect(User.findByEmail).toEqual(jasmine.any(Function));
  });

  describe('search', function() {
    beforeEach(function() {
      email = 'test@test.com';
      phone = 1234567890;
      password = 'password';
      user = new User({email: email, phone: phone, password: password});
      user.save();
    });

    afterEach(function() {
      User.remove({});
    });

    it('should find by email', function() {
      console.log(User.findByEmail(email));
      expect(User.findByEmail(email)).toEqual(email);
    });
  });

  describe('validation', function() {
    var email, phone, password;
    beforeEach(function() {
      email = 'test@test.com';
      phone = 1234567890;
      password = 'password';
    });

    it('should return true for valid phone number, email, and password', function() {
      expect(User.validateUser(email, password, phone)).toBe(true);
      phone = '123-123-1234';
      expect(User.validateUser(email, password, phone)).toBe(true);
    });

    it('should error on invalid phone number', function() {
      var invalidVals = [123, 'asdf212', 12345678901];
      __.each(invalidVals, function(val) {
        expect(User.validateUser(email, password, val)).toBe(false);
      });
    });

    it('should error on invalid password', function() {
      expect(User.validateUser(email, password, 'short')).toBe(false);
    });
    it('should error on invalid email', function() {
      var invalidVals = ['asdf', 'asdf@asdf', 'asdf@asdf.asdsdff'];
      __.each(invalidVals, function(val) {
        expect(User.validateUser(val, password, phone)).toBe(false);
      });
    });
  });

  describe('createUser', function() {
    it('should create a user in the database', function() {

    });

    it('should not create an invalid user in the database', function() {

    });

    it('should error when a user already exists', function() {

    });
  });

  xdescribe('updateUser', function() {
    it('should update if new username is valid', function() {

    });
    it('should update if new password is valid', function() {

    });
    it('should update if new email is valid', function() {

    });
    it('should update if new phone number is valid', function() {

    });
  });

  xdescribe('login', function() {

  });
});