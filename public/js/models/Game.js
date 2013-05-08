var Game = Backbone.Model.extend({
  url: '/game',

  initialize: function(data) {
    console.log('initialize game');
    console.log(data);
  }
});