var Teams = Backbone.Collection.extend({
  url: '/teams',
  model: Team,

  parse: function(data) {
    console.log(data);
    return _.map(data, function(item) {
      return new Team(item);
    });
  }
});
