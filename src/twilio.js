var __ = require('underscore'),
    User = require('../models/user.js'),
    Game = require('../models/game.js'),
    mongoose = require('mongoose'),
    express = require('express'),
    MongoStore = require('connect-mongo')(express),
    smsIDs = [];

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
    processRSVPs(allSms);
  });
};

// Packages msg content into [{dialedTo, sid, msgContent(body), date, direction}]
var getSmsContent = function(data) {
  var messageInfo = [];
  __.each(data, function(item) {
    if (item.direction === 'inbound') {
      messageData = {
        phone: item.from,
        sid : item.sid,
        body: item.body,
        date: item.date_created
      };
      messageInfo.push(messageData);
    }
  });
  return messageInfo;
};

// Combine and merge all texts from the same phone number.
var processRSVPs = function(messageArray) {
  console.log('filtering RSVPs');
  //console.log(messageArray);
  //console.log(smsIDs);
  var contains;

  for (var i = 0; i < messageArray.length; i++) {
    console.log(JSON.stringify(messageArray[i], null, 2));
    contains = __.contains(smsIDs, messageArray[i].sid);
    while (!contains) {
      console.log('how many times does this run?');
      smsIDs.push(messageArray[i].sid);
      if (messageArray[i].body.indexOf('#y') !== -1) {
        console.log('hell yes');
        var str = messageArray[i].body;
        var position = str.toLowerCase().indexOf('#');
        var code = str.slice(position - 3, position);
        // TODO: fix this to make sure it loops throught he array of messages:
        var digits = messageArray[i].phone.slice(3,99);
        rsvpUser(digits, code);
        contains = __.contains(smsIDs, messageArray[i].sid);
      }
      else if (messageArray[i].body.toLowerCase().indexOf('#n') !== -1) {
        return console.log('hell no');
        // remove from players attribute of our Game document
      } else {
        return;
        // sendSMS('Please reply [yourGameCode]#y to play or [yourGameCode]#n to sit this one out.', messageArray[i].phone);
      }
        // append to the confirmedPlayers attribute of our Game document
    }
  }
};

var rsvpUser = function(digits, code){
  User.findOne({phone : digits}, function(err, user){
    if(err) throw err;
    if(!user) throw new Error("user for digits " + digits + " not found");
    // see http://docs.mongodb.org/manual/reference/command/findAndModify/
    // also query to make sure the Game.players array contains the userName or userPhone 
    // TODO: 'userID' may not be correct
    Game.findAndModify( {
      query: {
        gameCode: code,
        gameTime: { $gt: Date.now },
        invitedPlayers: user._id
      }, // find any games with the response code
      update: {
        $pull: { invitedPlayers: user._id },
        $push: { confirmedPlayers: user._id },
        $inc: { confirmedPlayersCount: 1 }
      }
    });
  });
};

