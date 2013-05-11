var LoginView = Marionette.ItemView.extend({
  template: '#loginView-template',

  events: {
    'click #login': 'loginUser'
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

  loginUser: function(e) {
    console.log('Logging user in');
    e.preventDefault();

    // Grab username and password
    var inputs = this.$('.input-field');
    var params = {};
    _.each(inputs, function(param) {
      params[param.name] = param.value;
    });

    var that = this;
    this.model.login(params, function(err) {
      that.displayErrors('alert-error', err);
    });
  }
});
