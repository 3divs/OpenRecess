var RegisterView = Marionette.ItemView.extend({
  template: '#registerView-template',

  events: {
    'click #register': 'registerUser'
  },

  displayErrors: function(className, html) {
    var $form = this.$('form');
    $form.find('.alert').remove();
    $form.prepend('\
      <div class="alert ' + className + '" id="alert">' +
        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
          html +
      '</div>'
    );
  },

  registerUser: function(e) {
    e.preventDefault();
    // console.log('registering new user');

    // Grab form data and store it in model
    var fields = this.$el.find('.input-field');
    var params = {};
    _.each(fields, function(field) {
      params[field.name] = field.value;
    });

    // Set model and concat phone inputs
    this.model.set(params);
    this.model.sanitizePhoneNumber();

    // Validate user information
    var check = this.model.beforeSave();
    var that = this;
    // Check if model is valid
    if(check.isValid) {
      console.log('valid user');
      this.model.save(null, {
        error: function(model, response, options) {
          that.displayErrors('alert-error', response.responseText) ;
        },
        success: function(model, response, options) {
          that.displayErrors('alert-success', 'SUCCESS! Account created!');
          that.$('.input-field').val('');
        }
      });
    } else {
      // Display all client form validation errors
      var html = '<ul>';
      _.each(check.messages, function(msg) {
        html += '<li>' + msg + '</li>';
      });
      html += '</ul>';
      this.displayErrors('alert-error', html);
    }
  }

});
