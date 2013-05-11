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
    if(ensureAuthenticated()) {
      console.log('createGame shown');
      App.mainRegion.show(new CreateGameView());
    } else {
      App.router.navigate('login', true);
    }
  },

  showRegister: function() {
    console.log('showRegister shown');
    App.currentUser = App.currentUser || new User();
    App.mainRegion.show(new RegisterView({ model: user }));
  },

  showLogin: function() {
    console.log('showLogin shown');
    App.currentUser = App.currentUser || new User();
    App.mainRegion.show(new LoginView({ model: App.currentUser }));
  },

  showUserProfile: function() {
    console.log('showUserProfile shown');
    // TODO: Create a conditional case that checks to see if user is logged on
    if(ensureAuthenticated())
      App.mainRegion.show(new UserProfileView({ model: App.currentUser }));
    else
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
    'userProfile':  'showUserProfile'
  },

  controller: controller
});

// Initialize regions with views
App.addInitializer(function() {
  App.currentUser = App.currentUser || new User();
  App.headerRegion.show(new HeaderView({ model: App.currentUser }));
  // App.mainRegion.show(new GamesView({ collection: games }));
  App.footerRegion.show(new FooterView());
  App.router = new Router();
  App.currentUser.on('loggedIn', function() {
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
