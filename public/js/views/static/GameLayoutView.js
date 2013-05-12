GameLayoutView = Backbone.Marionette.Layout.extend({
  template: "#layout-template",
  id: "main-container",

  regions: {
    gmap: "#map-canvas",
    game: '#game'
  }
});