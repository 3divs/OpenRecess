GameLayoutView = Backbone.Marionette.Layout.extend({
  template: "#layout-template",

  regions: {
    gmap: "#map-canvas",
    game: "#game"
  }
});