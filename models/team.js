var mongoose = require('mongoose'),
    moment = require('moment'),
    User = require('./user.js'),
    Message = require('./message.js'),
    Game = require('./game.js'),
    Schema = mongoose.Schema;

var validatePresenceOf = function(value) {
  return value && value.length;
};

var TeamSchema = new mongoose.Schema({
  'name': { type: String, validate: [validatePresenceOf, 'please provide a team name'] },
  'managerName': String,
  'roster': { type: [User], validate: [validatePresenceOf, 'you can\'t play alone'] },
  'rosterCount': Number,
  'sport': String,
  'games' : [Game],
  'createdAt': { type: Date, 'default': Date.now },
  'updatedAt': Date
});


TeamSchema.pre('save', function(next) {

  this.updatedAt = new Date();

  this.numberOfPlayers = this.roster.length;

  next();
});

var Team = module.exports = mongoose.model('Team', TeamSchema);