var TeamsView = Marionette.CompositeView.extend({
  itemView: TeamView,
  itemViewContainer: '#teams',
  template: '#teamsView-template',
  className: 'teams-page',

  events: {
    'click #createTeam': 'createTeam'
  },

  initialize: function() {
    this.bind('add', this.render);
  },

  createTeam: function() {
    var newTeam = new Team();
    this.collection.add(newTeam);
  }
});
