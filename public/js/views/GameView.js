var GameView = Marionette.ItemView.extend({
  template: '#gameView-template',
  model: Game,
  className: 'span10 offset1 game',

  events: {
    'click .delete': 'deleteGame'
  },

  initialize: function() {
    this.transitionTime = 500;
  },

  deleteGame: function(e) {
    if(confirm('Are you sure?'))
      this.$el.fadeOut(this.transitionTime);

    // Remove model
    // this.model.destroy();
  }
});
