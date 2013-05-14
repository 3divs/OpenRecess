var Team = require('../models/team.js'),
    ObjectId = require('mongoose').Types.ObjectId,
    __ = require('underscore');

module.exports = {
  createTeam: function(req, res) {

  },

  deleteTeam: function(req, res) {
    console.log('Deleting team with id: ', req.body._id);
    Team.findOneAndRemove({'_id': new ObjectId(req.body._id)}, function(err, rowsUpdated, raw) {
      if(err) {
        console.log(err);
        res.json(500, err.err);
      } else {
        res.json(200, 'Team deleted');
      }
    });
  },

  updateTeam: function(req, res) {
    console.log('Updating team with id: ', req.body._id);
    if(req.body._id) {
      console.log(req.body);
      var newTeam = __.omit(req.body, '_id');
      Team.findOneAndUpdate({'_id': new ObjectId(req.body._id)}, newTeam, function(err, rowsUpdated, raw) {
        if(err) {
          console.log(err);
          res.json(500, err.err);
        }
        else {
          res.json(200, 'Team updated successfully');
        }
      });
    } else
      res.json(400, 'Invalid request');
  },

  findTeams: function(req, res) {
    console.log('Getting teams for user: ', req.user.email);
    Team.find({managerEmail: req.user.email}, function(err, results) {
    // Team.find({}, function(err, results) {
      if(err)
        res.json(400, err.err);
      else {
        res.json(200, results);
      }
    });
  }
};
