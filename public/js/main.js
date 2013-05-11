var App = new Backbone.Marionette.Application();

// Create the app regions on the page
App.addRegions({
  headerRegion: '#header',
  mainRegion: '#main',
  footerRegion: '#footer'
});

// Routes
var controller = {
  // Display games list
  showGames: function() {
    console.log('listGames shown');

    var games = new Games();
    games.fetch();

    var layout = new GameLayoutView();
    
    layout.game.show(new GamesView({ collection: games }));
    layout.gmap.show(new MapsView());

    App.mainRegion.show(layout);
    initialize();
    // var games = new Games();
    // games.fetch();
    // var gamesView = new GamesView({ collection: games });
    // App.mainRegion.show();
  },

  showSplash: function() {
    console.log('showSplash shown');
    App.mainRegion.show(new SplashView());
  },

  showCreateGame: function() {
    if(App.currentUser) {
      console.log('createGame shown');
      App.mainRegion.show(new CreateGameView());
    } else {
      App.router.navigate('login', true);
    }
  },

  showRegister: function() {
    console.log('showRegister shown');
    App.mainRegion.show(new RegisterView());
  },

  showLogin: function() {
    console.log('showLogin shown');
    App.mainRegion.show(new LoginView());
  },

  showUserProfile: function() {
    console.log('showUserProfile shown');
    // TODO: Create a conditional case that checks to see if user is logged on
    if(App.currentUser)
      App.mainRegion.show(new UserProfileView({ model: App.currentUser }));
    else
      App.router.navigate('login', true);
  },

  showMap: function() {
    console.log('showMap shown');
    App.mainRegion.show(new MapsView());
    initialize();
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

  // Grab user information on page load
  var user = new User();
  user.fetch({
    success: function() {
      if(user.get('email'))
        App.currentUser = user;
    }
  });

  App.headerRegion.show(new HeaderView({ model: user }));
  // App.mainRegion.show(new GamesView({ collection: games }));
  App.footerRegion.show(new FooterView());
  App.router = new Router();
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
