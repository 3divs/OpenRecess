var GamesView = Marionette.CompositeView.extend({
  itemView: GameView,
  itemViewContainer: '#games',
  template: '#gamesView-template',
  className: 'games-page'
});
