var Team = Backbone.Model.extend({
  url: '/team',

  defaults: {
    name: 'Team Cool Guys',
    type: 'Soccer',
    players: ['John', 'Bob', 'Mary'],
    numOfPlayers: 3,
    managerId: '12345',
    managerName: 'Mark'
  }
});
