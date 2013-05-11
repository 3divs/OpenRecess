var TeamsView = Marionette.CompositeView.extend({
  itemView: TeamView,
  itemViewContainer: '#teams',
  template: '#teamsView-template'
});
