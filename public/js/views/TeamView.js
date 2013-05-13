var TeamView = Marionette.ItemView.extend({
  model: Team,
  template: '#teamView-template',

  events: {
    'click .team': 'showDetails'
  },

  showDetails: function(e) {
    // console.log()
    this.$('.details').slideToggle(500);
  },

  onRender: function() {
    // Hide the details
    this.$('.details').hide();
  }
});
