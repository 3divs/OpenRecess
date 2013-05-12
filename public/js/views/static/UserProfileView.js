var UserProfileView = Marionette.ItemView.extend({
  template: '#show-userProfileView-template',
  model: User,

  events: {
    'click #update': 'updateUser'
  },

  updateUser: function(e) {
    console.log('updating user');
  }
});