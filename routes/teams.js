var Team = require('../models/team.js');

module.exports = {
  createTeam: function(req, res) {

  },

  deleteTeam: function(req, res) {

  },

  updateTeam: function(req, res) {
    console.log(req.body);
    if(req.body._id) {
      var newTeam = req.body;
      // Team.findOne({_id: req.body._id}, function(err, rows, raw) {
      //   console.log(err, rows, raw);
      // });
      delete newTeam['_id'];
      Team.findOneAndUpdate({'_id': req.body._id + ''}, newTeam, function(err, rowsUpdated, raw) {
        if(err) {
          console.log(err);
          res.json(500, err.err);
        }
        else {
          console.log(rowsUpdated, raw);
          res.json(200, 'Team updated successfully');
        }
      });
    } else
      res.json(400, 'Invalid request');
  },

  findTeams: function(req, res) {
    // console.log('Getting teams for user: ', req.user.email);
    // Team.find({managerEmail: req.user.email}, function(err, results) {
    Team.find({}, function(err, results) {
      if(err)
        res.json(400, err.err);
      else {
        res.json(200, results);
      }
    });
  }
};
