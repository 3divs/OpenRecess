var UserProfileView = Marionette.ItemView.extend({
  template: '#show-userProfileView-template',
  model: User,

  events: {
    'click #update': 'updateUser'
  },

  updateUser: function(e) {
    e.preventDefault();
    console.log('updating user');
  }
});