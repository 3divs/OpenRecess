var Team = Backbone.Model.extend({
  url: '/team',

  defaults: {
    name: 'Team Cool Guys',
    type: 'Soccer',
    players: [
      {name: 'John', phone:'+1234567890'},
      {name: 'Bob', phone:'+1234567890'},
      {name: 'Mary', phone:'+1234567890'}
    ],
    numOfPlayers: 3,
    managerId: '12345',
    managerName: 'Mark'
  }
});
