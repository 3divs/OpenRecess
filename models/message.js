var mongoose = require('mongoose'),
    moment = require('moment'),
    User = require('./user.js'),
    Game = require('./game.js'),
    Schema = mongoose.Schema;


var MessageSchema = new mongoose.Schema({
  'body': String,
  'recipient': Schema.Types.ObjectId,
  'sender': Number,
  'processed': { type: Boolean}
});

MessageSchema.pre('save', function(next) {
  // do some pre-save shit here

  next();

});

var Message = module.exports = mongoose.model('Message', MessageSchema);
