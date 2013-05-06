var crypto = require('crypto');

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

module.exports = function(mongoose) {
  var userSchema = mongoose.Schema({
    'email': {type: String, validate: [validateEmail, 'email is invalid'], index: {unique: true} },
    'phone': {type: Number, validate: [validatePhone, 'phone number invalid']},
    'display_name': {type: String},
    'hashed_password': {type: String},
    'salt': String
  });

  userSchema.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  userSchema.virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

  userSchema.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  });

  userSchema.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  userSchema.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  });

  userSchema.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });

  return mongoose.model('User', userSchema);
};