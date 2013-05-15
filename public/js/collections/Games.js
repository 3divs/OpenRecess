var Games = Backbone.Collection.extend({
  url: '/games',

  model: Game,

  getMyGames: function() {
    console.log('fetching users games');
  }
});