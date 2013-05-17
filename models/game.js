var mongoose = require('mongoose'),
    moment = require('moment'),
    User = require('./user.js'),
    Message = require('./message.js'),
    Team = require('./team.js'),
    Schema = mongoose.Schema;

var validatePresenceOf = function(value) {
  return value && value.length;
};

// var InvitedUser = new Schema({
//   'phone' : String,
//   'userId' : Schema.Types.ObjectId
// });

// TODO: Alert we need to validate the gameTime on the client before sending to the model as a Date.
var GameSchema = new Schema({
  'invitedPlayers': Array, // make this an object of ObjectIds of users or user phone numbers
  'manager': Schema.Types.ObjectId,
  'gameCode': Number,
  'createdAt': { type: Date, 'default': Date.now },
  'updatedAt': Date,
  'gameDate': { type: Date, validate: [validatePresenceOf, 'please provide a game date'] },
  'gameTime': { type: String, validate: [validatePresenceOf, 'please provide a game time'] },  // TODO: change to date
  'gameName': { type: String, validate: [validatePresenceOf, 'please provide a game title'] },
  'gameType': { type: String, validate: [validatePresenceOf, 'please choose a game type'] }, // eventually convert this into a foreign key for a collection of gameTypes 
  // 'gameAddress': { type: String, validate: [validatePresenceOf, 'if you expect people to show up, you\'d better tell them where to go'] },
  'coord' : {
    'lat' : Number,
    'lon' : Number
  },
  'minimumPlayers': Number,
  'confirmedPlayers': Array,
  'confirmedPlayersCount' : Number,
  'playerLimit': Number,
  'minimumPlayersMet': Boolean,
  'playerLimitMet': Boolean,
  'messages': Schema.Types.ObjectId
});

GameSchema.pre('save', function(next) {

  // Update updatedAt time
  this.updatedAt = new Date();

  // Update confirmed player count
  if(this.confirmedPlayers && this.confirmedPlayers.length > 0) {
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
