var Games = Backbone.Collection.extend({
  url: '/games',
  model: 'Game',

  initialize: function() {
    console.log('Games initialized');
  },

  parse: function(data) {
    console.log(data);
    return _.map(data, function(game) {
      return new Game(game);
    });
  }
});