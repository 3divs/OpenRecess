var Team = require('../models/team.js');

module.exports = {
  createTeam: function(req, res) {

  },

  deleteTeam: function(req, res) {

  },

  findTeams: function(req, res) {
    console.log('findTeams');
    Team.find({}, function(err, results) {
      if(err)
        res.json(400, err.err);
      else {
        res.json(200, results);
      }
    });
  }
};
