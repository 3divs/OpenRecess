var TeamsView = Marionette.CompositeView.extend({
  itemView: TeamView,
  itemViewContainer: '#teams',
  template: '#teamsView-template',

  events: {
    'click #createTeam': 'createTeam'
  },

  initialize: function() {
    this.bind('add', this.render);
  },

  createTeam: function() {
    console.log('new team');
    var newTeam = new Team();
    this.collection.add(newTeam);
    console.log(this.collection.length);
  }
});
