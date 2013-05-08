var App = new Backbone.Marionette.Application();

// Create the app regions on the page
App.addRegions({
  gamesRegion: '#games',
  headerRegion: '#header'
});

// Initialize Game View on app initialization
App.addInitializer(function() {
  var myView = new GameView({ model: new Game() });
  App.gamesRegion.show(myView);
});

$(function() {
  App.start();
});
