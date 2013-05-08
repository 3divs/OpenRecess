var App = new Backbone.Marionette.Application();

// Create the app regions on the page
App.addRegions({
  mainRegion: '#main',
  headerRegion: '#header',
  footerRegion: '#footer'
});

// Routes
var controller = {
  // Display games list
  showGames: function() {
    console.log('listGames shown');
    var games = new Games();
    games.fetch();
    App.mainRegion.show(new GamesView({ collection: games }));
  },

  showSplash: function() {
    console.log('showSplash shown');
    App.mainRegion.show(new SplashView());
  },

  showCreateGame: function() {
    console.log('createGame shown');
    App.mainRegion.show(new CreateGameView());
  },

  showRegister: function() {
    console.log('showRegister shown');
    App.mainRegion.show(new RegisterView());
  },

  showLogin: function() {
    console.log('showLogin shown');
    App.mainRegion.show(new LoginView());
  }
};

var Router = Marionette.AppRouter.extend({
  appRoutes: {
    'games':        'showGames',
    'splash':       'showSplash',
    'game':         'showCreateGame',
    'register':     'showRegister',
    'login':        'showLogin'
  },

  controller: controller
});


// Initialize regions with views
App.addInitializer(function() {
  App.headerRegion.show(new HeaderView());
  // App.mainRegion.show(new GamesView({ collection: games }));
  App.footerRegion.show(new FooterView());
  new Router();
});

App.on('initialize:after', function() {
  if(Backbone.history) {
    console.log('starting Backbone history');
    Backbone.history.start();
  }
});

$(function() {
  App.start();
});
