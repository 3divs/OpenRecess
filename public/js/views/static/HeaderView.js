var HeaderView = Marionette.ItemView.extend({
  template: '#headerView-template',

  events: {
    'click a': 'selectLink'
  },

  initialize: function() {},

  selectLink: function(link) {
    console.log('link selected: ', link);
  }
});