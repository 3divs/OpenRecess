var User = Backbone.Model.extend({
  url: '/user/current',

  defaults: {
    'email': ''
  },

  parse: function(data) {
    console.log('user data: ', data);
    return data;
  }
});
