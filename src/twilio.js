var __ = require('underscore'),
    user = require('../models/user.js'),
    game = require('../models/game.js'),
    mongoose = require('mongoose'),
    express = require('express'),
    MongoStore = require('connect-mongo')(express);


// temporary variable should be moved to a 'secrets' file
var accountSid = "AC5933d34eda950c0bb81ed94811a9c13c";
var authToken = "99143cc9267d4ad6db22cdc12856ad5a";

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
      Message.insert(); // put all the shit below in our DB...
      console.log('Sending SMS to: ' + message.to);
      console.log('Message content: ' + message.body);
      console.log('Status of text message is: ' + message.status);
  });
};

exports.retrieveSMS = function(req, res) {
  console.log('retrieving SMS');
  var allSms;
  client.sms.messages.list(function(err, data) {
    allSms = getSmsContent(data.sms_messages);
  });
};

exports.processRSVPs = function(req, res) {
  console.log('filtering RSVPs');
  console.log(req);
  client.sms.messages.list(function(err, data) {
    if (client.sms_messages.body.toLowerCase().indexOf('#y') !== -1) {
      var str = client.sms_messages.body;
      var position = str.toLowerCase().indexOf('#');
      var code = str.slice(position - 3, position);
      // TODO: fix this to make sure it loops throught he array of messages:
      var digits = client.sms_messages.from.slice(3,99); 
      var userID = User.find({phone : digits})._id;
        // see http://docs.mongodb.org/manual/reference/command/findAndModify/
        // also query to make sure the Game.players array contains the userName or userPhone 
        // TODO: 'userID' may not be correct
      Game.findAndModify( {
        query: {
          gameCode: code,
          gameTime: { $gt: Date.now },
          invitedPlayers: userID
        }, // find any games with the response code
        update: {
          $pull: { invitedPlayers: userID},
          $push: { confirmedPlayers: userID },
          $inc: { confirmedPlayersCount: 1 }
        }
      });
      // append to the confirmedPlayers attribute of our Game document
    }
    else if (client.sms_messages.body.toLowerCase().indexOf('#n') !== -1) {
      // remove from players attribute of our Game document
    } else {
      sendSMS('Please reply [yourGameCode]#y to play or [yourGameCode]#n to sit this one out.', client.sms.messages);
    }

  });

};

// Packages msg content into [{dialedTo, sid, msgContent(body), date, direction}]
var getSmsContent = function(data) {
  var messageInfo = [];
  __.each(data, function(item) {
    messageData = {
      phone: item.from,
      sid : item.sid,
      body: item.body,
      date: item.date_created,
      direction: item.direction
    };
    messageInfo.push(messageData);
  });
  console.log(messageInfo);
  return messageInfo;
};

// Combine and merge all texts from the same phone number.
var inboundNum = function(data) {
};
