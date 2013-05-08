var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Game = require('./game.js'),
    Message = require('./message.js');

function validatePresenceOf(value) {
  return value && value.length;
}

function validatePhone(number) {
  return (number + '').replace(/\-/g, '').length === 10;
}

function validateEmailFormat(email) {
  var regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;
  return regex.test(email);
}

function validateEmail(email) {
  return validateEmailFormat(email) && validatePresenceOf(email);
}

var UserSchema = new mongoose.Schema({
  'email': {type: String, validate: [validateEmail, 'email is invalid'], index: {unique: true} },
  'phone': {type: Number, validate: [validatePhone, 'phone number invalid']},
  'display_name': {type: String},
  'hashed_password': {type: String},
  'salt': String,
  'upcomingGames': [Number],
  'gamesPlayed': [Number]
});

UserSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password; });

UserSchema.method('authenticate', function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
});

UserSchema.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
});

UserSchema.method('encryptPassword', function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

UserSchema.pre('save', function(next) {
  if (!validatePresenceOf(this.password)) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

UserSchema.method('checkPassword', function(password) {
  if(!this.hashed_password || !this.salt) return false;
  var hash = this.encryptPassword(password);
  return (hash === this.hashed_password);
});

var User = mongoose.model('User', UserSchema);

User.login = function(username, password, cb){
  console.log('User logging in: ', username, password);
  User.findOne({email: username}, function(err, user){
    // console.log(err, user);
    if(err) return cb(err);
    if(!user) return cb(null, null);
    if(user.checkPassword(password)) return cb(null, user);
    return cb(null, null, { message : 'Invalid username or password.'});
  });
};

module.exports = User;