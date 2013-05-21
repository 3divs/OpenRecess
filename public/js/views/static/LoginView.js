var LoginView = Marionette.ItemView.extend({
  template: '#loginView-template',

  events: {
    'click #login': 'loginUser',
    'keypress input[name="password"]': 'checkLogin'
  },

  displayErrors: function(className, html) {
    var $form = this.$('.login-container');
    $form.find('.alert').remove();
    $form.prepend('\
      <div class="alert ' + className + '" id="alert">' +
        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
          html +
      '</div>'
    );
  },

  checkLogin: function(e) {
    if(e.which === 13)
      this.loginUser(e);
  },

  loginUser: function(e) {
    e.preventDefault();

    // Grab username and password
    var inputs = this.$('.input-field');
    var params = {};
    _.each(inputs, function(param) {
      params[param.name] = param.value;
    });

    var that = this;
    // Log user in and display errors, if available
    this.model.login(params, function(err) {
      that.displayErrors('alert-error', err);
    });
  }
});
