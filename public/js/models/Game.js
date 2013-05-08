var Game = Backbone.Model.extend({
  url: 'http://localhost:5000/game',

  initialize: function() {
    console.log('init');
    this.text = 'test text';
  }
});