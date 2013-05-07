var mongoose = require('mongoose');
var moment = require('moment');
var User = require('./user.js');

var GameSchema = new mongoose.Schema({
  'players': [Number],
  // 'manager': UserSchema.types.ObjectId,
  'createdAt': Date,
  'updatedAt': Date,
  'gameTime': String,  // TODO: change to date
  'gameName': String,
  'gameType': String,
  'gameAddress': String,
  'minimumPlayers': Number,
  'totalPlayers': Number
});

var Game = module.exports = mongoose.model('Game', GameSchema);
