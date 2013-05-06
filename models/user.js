module.exports = function(mongoose) {
  var User = mongoose.model('User', {
    // uid:  {type: Number, unique: true},
    email: {type: String, unique: true},
    phone: {type: Number},
    display_name: {type: String},
    password: {type: String}
  });

  User.createUser = function(email, password, phone) {
    if(validateUser(email, password, phone)) {
      return true;
    } else
      return undefined;
  };

  // Check validity of the User being created
  User.validateUser = function(email, password, phone) {
    // Check email validity
    if(email.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/) === null)
      return false;

    // Check password validity
    //  - Less than 6 characters
    if(password.length < 6)
      return false;

    // Check phone number validity
    if((phone + '').replace(/\-/g, '').length !== 10)
      return false;

    // Everything passed, so return true
    return true;
  };

  User.updateUser = function() {

  };

  User.findByEmail = function(email, cb) {
    this.findOne({email: email}, function(err, user) {
      console.log(err);
      return user;
    });
  };

  return User;
};