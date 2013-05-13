CreateGameLayoutView = Backbone.Marionette.Layout.extend({
  template: "#create-gameLayoutView",

  regions: {
    gmap: "#map-canvas",
    gameCreate: '#createGame'
  }
});