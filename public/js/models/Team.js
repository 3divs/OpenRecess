var Team = Backbone.Model.extend({
  idAttribute: '_id',
  url: '/teams',

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
    // TODO: Validate name and phone

    // Add new user to roster and save
    this.get('roster').push({
      name: name,
      phone: phone
    });
    this.save();
  },

  editRosterPlayer: function(name, phone) {
    // TODO: Validate name and phone
    var newRoster = _.map(this.get('roster'), function(player) {
      if(player.name === name)
        player.phone = phone;
      return player;
    });
    this.save({roster: newRoster});
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
