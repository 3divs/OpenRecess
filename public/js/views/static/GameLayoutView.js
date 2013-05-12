GameLayoutView = Backbone.Marionette.Layout.extend({
  template: "#layout-template",
  className: 'span10 offset1',

  regions: {
    gmap: "#map-canvas",
    game: '#game'
  }
});