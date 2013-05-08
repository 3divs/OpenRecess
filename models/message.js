var mongoose = require('mongoose'),
    moment = require('moment'),
    User = require('./user.js'),
    Game = require('./game.js');

var MessageSchema = new mongoose.Schema({
  'body': String,
  'recipient': Object,
  'sender': Object,
  'processed': { type: Boolean}
});

MessageSchema.pre('save', function(next) {
  // do some pre-save shit here

  next();

});

var Message = module.exports = mongoose.model('Message', MessageSchema);
