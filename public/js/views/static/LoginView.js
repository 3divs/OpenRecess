var LoginView = Marionette.ItemView.extend({
  template: '#loginView-template',

  events: {
    'click #login': 'loginUser'
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

    console.log(params);

    // Ajax call to login user
    $.ajax('/login', {
      data: params,
      type: 'POST',
      success: function(data) {
        console.log('successful login');
        console.log(data);
      },
      error: function(err) {
        console.log('unsuccessful login');
        console.log(err);
      }
    });

  }
});
