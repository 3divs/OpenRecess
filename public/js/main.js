var App = new Backbone.Marionette.Application();

// Create the app regions on the page
App.addRegions({
  headerRegion: '#header',
  mainRegion: '#main',
  footerRegion: '#footer'
});

var ensureAuthenticated = function() {
  return App.currentUser && App.currentUser.get('email');
};

// Routes
var controller = {
  signOut: function() {
    App.currentUser.signOut();
  },

  // Display games list
  showGames: function() {
    var games = new Games();
    games.fetch();

    var layout = new GameLayoutView();
    App.mainRegion.show(layout);
    layout.gmap.show(new MapsView());
    initialize(games);
  },
  showSplash: function() {
    App.mainRegion.show(new SplashView());
  },

  showCreateGame: function() {
    if(ensureAuthenticated()) {
      var games = new Games();
      games.fetch();

      var layout = new CreateGameLayoutView();
      App.mainRegion.show(layout);
      layout.gameCreate.show(new CreateGameView());
      layout.gmap.show(new MapsView());
      initialize(games);
    } else
      App.router.navigate('login', true);
  },

  showRegister: function() {
    App.currentUser = App.currentUser || new User();
    App.mainRegion.show(new RegisterView({ model: App.currentUser }));
  },

  showLogin: function() {
    App.currentUser = App.currentUser || new User();
    App.mainRegion.show(new LoginView({ model: App.currentUser }));
  },

  showUserProfile: function() {
    if(ensureAuthenticated())
      App.mainRegion.show(new UserProfileView({ model: App.currentUser }));
    else
      App.router.navigate('login', true);
  },

  showTeams: function() {
    if(ensureAuthenticated()) {
      App.mainRegion.show();
    } else
      App.router.navigate('login', true);
  }
};

var Router = Marionette.AppRouter.extend({
  appRoutes: {
    'games':        'showGames',
    'splash':       'showSplash',
    'game':         'showCreateGame',
    'register':     'showRegister',
    'login':        'showLogin',
    'userProfile':  'showUserProfile',
    'teams':        'showTeams',
    'signout':      'signOut'
  },

  controller: controller
});

// Initialize regions with views
App.addInitializer(function() {
  App.currentUser = App.currentUser || new User();
  App.headerRegion.show(new HeaderView({ model: App.currentUser }));
  // App.mainRegion.show(new GamesView({ collection: games }));
  // App.footerRegion.show(new FooterView());
  App.router = new Router();
  App.currentUser.on('redirectSplash', function() {
    App.router.navigate('splash', true);
  });
});

App.on('initialize:after', function() {
  if(Backbone.history) {
    Backbone.history.start();
  }
});

$(function() {
  App.start();
});
