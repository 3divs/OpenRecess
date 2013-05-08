var Games = Backbone.Collection.extend({
  url: '/games',
  model: 'Game',

  parse: function(data) {
    console.log('new games - ', data);
    return _.map(data, function(game) {
      return new Game(game);
    });
  }
});