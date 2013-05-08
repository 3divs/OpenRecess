var mongoose = require('mongoose');
var moment = require('moment');
var User = require('./user.js');

var validatePresenceOf = function(value) {
  return value && value.length;
};

var GameSchema = new mongoose.Schema({
  'players': [String],
  // 'manager': UserSchema.types.ObjectId,
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': Date,
  'gameTime': { type: String, validate: [validatePresenceOf, 'please provide a game time'] },  // TODO: change to date
  'gameName': { type: String, validate: [validatePresenceOf, 'please provide a game title'] },
  'gameType': { type: String, validate: [validatePresenceOf, 'please choose a game type'] }, // eventually convert this into a foreign key for a collection of gameTypes 
  'gameDescription': String,
  'gameLocation': { type: String, validate: [validatePresenceOf, 'if you expect people to show up, you\'d better tell them where to go'] },
  'gameAddress': { type: String, validate: [validatePresenceOf, 'if you expect people to show up, you\'d better tell them where to go'] },
  'minimumPlayers': Number,
  'confirmedPlayers': [Number],
  'confirmedPlayersCount' : Number,
  'playerLimit': Number,
  'minimumPlayersMet': Boolean,
  'playerLimitMet': Boolean,
  'messages': Object
});

GameSchema.pre('save', function(next) {

  // Update updatedAt time
  this.updatedAt = new Date();

  // Update confirmed player count
  if(this.confirmedPlayers.length > 0) {
    this.confirmedPlayersCount = this.confirmedPlayers.length;

    // Update player limit boolean
    if(this.confirmedPlayersCount > this.playerLimit)
      this.playerLimitMet = true;
    else
      this.playerLimitMet = false;

    // Update minimum player boolean
    if(this.confirmedPlayersCount >= this.minimumPlayers)
      this.minimumPlayersMet = true;
    else
      this.minimumPlayersMet = false;
  }

  next();
});

var Game = module.exports = mongoose.model('Game', GameSchema);
