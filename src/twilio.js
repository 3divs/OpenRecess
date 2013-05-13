var __ = require('underscore'),
    mongoose = require('mongoose'),
    User = require('../models/user.js'),
    Game = require('../models/game.js'),
    Message = require('../models/message.js'),
    express = require('express'),
    MongoStore = require('connect-mongo')(express);

// temporary variables should be reset and moved to a 'secrets' file
var accountSid = "AC5933d34eda950c0bb81ed94811a9c13c";
var authToken = "99143cc9267d4ad6db22cdc12856ad5a";
var twilioPhoneNumber = '+14159928245';

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
  processRSVPs(textMessage, senderPhone);
  res.send(200, ' Thanks for your reply. ~OpenRecess.com');
};

// Combine and merge all texts from the same phone number.
var processRSVPs = function(message, sender) {
  var position = message.toLowerCase().indexOf('#');
  var code = message.slice(position - 3, position);
  if (message.indexOf('#y') !== -1) {
    console.log('hell yes');
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
  var userID;

  User.findOne({ phone: digits }, function(result) {
    userID = result;
  })

  Game.findOneAndUpdate( {
      gameCode : code,
      // gameTime: { $gt: Date.now },
      invitedPlayers : userID
    },
    {
      $pull : { invitedPlayers : userID },
      $push : { confirmedPlayers : userID },
      $inc : { confirmedPlayersCount : 1 }
    },
    function(err, thisGame){
      if(err) throw 'wtf?';
      if (!thisGame) {
        exports.sendSMS('Thanks for the message, but it looks like you\'ve already RSVP\'d to this game. ~OpenRecess.com.', digits, twilioPhoneNumber);
      } else {
        exports.sendSMS('Game on for ' + thisGame.gameType + '#' + thisGame.gameCode + ' on ' + thisGame.gameDate + ' at ' + thisGame.gameTime + '. Stay tuned for more text message updates.', digits, twilioPhoneNumber);        
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

