var App = new Backbone.Marionette.Application();

// Create the app regions on the page
App.addRegions({
  gamesRegion: '#games',
  headerRegion: '#header'
});

// Initialize Game View on app initialization
App.addInitializer(function() {
  var myView = new GameView({ model: new Game() });
  var games = new Games();
  games.fetch();
  var gamesView = new GamesView({ collection: games });
  App.gamesRegion.show(gamesView);
});

$(function() {
  App.start();
});
