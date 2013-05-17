var __ = require('underscore'),
    mongoose = require('mongoose'),
    User = require('../models/user.js'),
    Game = require('../models/game.js'),
    Message = require('../models/message.js'),
    express = require('express'),
    moment = require('moment'),
    config = require('../config/config.js'),
    MongoStore = require('connect-mongo')(express);

// temporary variables should be reset and moved to a 'secrets' file
var accountSid = config.twilioSID;
var authToken = config.twilioAuth;
var twilioPhoneNumber = config.twilioNumber;

var client = require('twilio')(accountSid, authToken);


exports.sendSMS = function(message, userNumber, twilioNumber, req, res) {
  client.sms.messages.create({
      body: message,
      to: userNumber,
      from: twilioNumber
  }, function(err, message) {
      if (err) {
        console.log('error');
      }
      // Message.insert(); // put all the shit below in our DB...
      console.log('Sending SMS to: ' + message.to);
      console.log('Message content: ' + message.body);
      console.log('Status of text message is: ' + message.status);
  });
};

// function that is run upon a Twilio POST request
exports.retrieveSMS = function(req, res) {
  var textMessage = req.body.Body;
  var senderPhone = req.body.From;
  console.log(textMessage, senderPhone);
  processRSVPs(textMessage, senderPhone);
  res.send(200, ' Thanks for your reply. ~OpenRecess.com');
};

// Combine and merge all texts from the same phone number.
var processRSVPs = function(message, sender) {
  var position = message.toLowerCase().indexOf('#');
  var code = message.slice(position - 3, position);
  if (message.indexOf('#y') !== -1) {
    console.log('hell yes');
    console.log(sender, code);
    rsvpUser(sender, code);
  }
  else if (message.indexOf('#n') !== -1) {
    removeUser(sender, code);
    console.log('hell no');
  } else {
    exports.sendSMS('Please reply [yourGameCode]#y to play or [yourGameCode]#n to sit this one out.', sender, twilioPhoneNumber);
  }
    // append to the confirmedPlayers attribute of our Game document
};

// function that processes sms replies from users
var rsvpUser = function(digits, code){
  Game.findOneAndUpdate( {
      gameCode : code,
      // gameTime: { $gt: Date.now },
      invitedPlayers : digits
    },
    {
      $pull : { invitedPlayers : digits },
      $push : { confirmedPlayers : digits },
      $inc : { confirmedPlayersCount : 1 }
    },
    function(err, thisGame){
      if(err) throw 'Error';
      if (!thisGame) {
        exports.sendSMS('Thanks for the message. Either you already RSVP\'d to this game or you aren\'t authorized to join. ~OpenRecess.com.', digits, twilioPhoneNumber);
      } else {
        var message = 'Game on for ' + thisGame.gameType + ' #' + thisGame.gameCode + ' on ' + moment(thisGame.gameDate).format("L") + ' at ' + thisGame.gameTime + '. Stay tuned for more text message updates.';
        if (message.length > 144) {
          exports.sendSMS(message, digits, twilioPhoneNumber);
        } else {
          exports.sendSMS(message + ' ~OpenRecess.com', digits, twilioPhoneNumber);
        }
      }
    }
  );

};

var removeUser = function(digits, code){
  Game.findOneAndUpdate({
    gameCode : code,
    invitedPlayers : digits
  },
  {
    $pull : {invitedPlayers : digits}
  }, function(err, data){
    if (err) throw err;
    console.log(data);
    exports.sendSMS('Thanks for your reply. ' + data.gameType + ' won\'t be the same without you.', digits, twilioPhoneNumber);
  });
};

