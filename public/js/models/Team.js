var Team = Backbone.Model.extend({
  url: '/teams',
  idAttribute: '_id',

  defaults: {
    name: 'Team Cool Guys',
    sport: 'Soccer',
    roster: [
      {name: 'John', phone:'+2345678901'},
      {name: 'Bob', phone:'+3456789012'},
      {name: 'Mary', phone:'+4567890123'}
    ],
    rosterCount: 3,
    managerId: '12345',
    managerName: 'Mark'
  },

  addRosterPlayer: function(name, phone) {

  },

  deleteRosterPlayer: function(name, phone) {
    var newRoster = _.filter(this.get('roster'), function(item) {
      return item.name !== name && item.phone !== phone;
    });
    console.log(newRoster);
    this.save({roster: newRoster});
  },

  sendSms: function(msg) {
    
  }
});
