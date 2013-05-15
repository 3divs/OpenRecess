var User = Backbone.Model.extend({
  url: '/users',

  defaults: {
    'email': ''
  },

  initialize: function() {
    this.validators = {};

    // Model validations for client-side form validation
    this.validators.display_name = function (value) {
      return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
    };

    this.validators.email = function (value) {
      return value.length > 0  && /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/.test(value) ?
        {isValid: true} : {isValid: false, message: "You must enter a valid email"};
    };

    this.validators.phone = function (value) {
      return value.length > 0 && /\d{10}/.test(value) ? {isValid: true} : {isValid: false, message: "You must enter a valid phone number"};
    };

    this.validators.password = function (value) {
      return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a password"};
    };

    // Fetch previous user profile if user closed window/tab
    var that = this;
    $.ajax('/user/current', {
      type: 'GET',
      success: function(data) {
        that.set(data);
      }
    });
  },

  sanitizePhoneNumber: function() {
    this.set('phone', '' + this.get('phone1') +  this.get('phone2') + this.get('phone3'));
    this.unset('phone1');
    this.unset('phone2');
    this.unset('phone3');
  },

  parse: function(data) {
    return data;
  },

  beforeSave: function() {
    var messages = {};

    // Validate all form/user fields
    _.each(this.validators, function(validator, key) {
      var check = validator(this.get(key));
      if(check.isValid === false) {
        messages[key] = check.message;
      }
    }, this);

    return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
  },

  login: function(params, cb) {
    // Ajax call to login user
    var that = this;
    $.ajax('/login', {
      data: params,
      type: 'POST',
      success: function(data) {
        that.set(data);

        // trigger App redirect on successful login
        that.trigger('redirectGames');
      },
      error: function(err) {
        cb('Invalid Username/Password');
      }
    });
  },

  signOut: function() {
    var that = this;
    $.ajax('/logout', {
      type: 'GET',
      success: function(data) {
        // Clear App.currentUser model
        that.clear({ silent: true });
        that.set('email', '');

        // trigger App redirect on successful logout
        that.trigger('redirectSplash');
      }
    });
  }
});
