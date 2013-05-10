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

exports.retrieveSMS = function(req, res) {
  var textMessage = req.body.Body;
  var senderPhone = req.body.From;
  console.log(req.body, textMessage, senderPhone);
  processRSVPs(textMessage, senderPhone);
  res.send(200, ' thanks for your reply.');
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
var processRSVPs = function(message, sender) {
  console.log('filtering RSVPs');
  if (message.indexOf('#y') !== -1) {
    console.log('hell yes');
    var position = message.toLowerCase().indexOf('#');
    var code = message.slice(position - 3, position);
    var digits = sender.slice(2, 99);
    rsvpUser(digits, code);
  }
  else if (messageArray[i].body.toLowerCase().indexOf('#n') !== -1) {
    return console.log('hell no');
    // remove from players attribute of our Game document
  } else {
    sendSMS('Please reply [yourGameCode]#y to play or [yourGameCode]#n to sit this one out.', messageArray[i].phone);
  }
    // append to the confirmedPlayers attribute of our Game document
};

var rsvpUser = function(digits, code){
  User.findOne({phone : digits}, function(err, user){
    if(err) throw err;
    if(!user) throw new Error("user for digits " + digits + " not found");
    // see http://docs.mongodb.org/manual/reference/command/findAndModify/
    // also query to make sure the Game.players array contains the userName or userPhone 
    // TODO: 'userID' may not be correct
    console.log(Object.keys(Game));
    Game.findOneAndUpdate( {
        gameCode: code,
        // gameTime: { $gt: Date.now },
        invitedPlayers: user._id
      }, // find any games with the response code
      {
        $pull: { invitedPlayers: user._id },
        $push: { confirmedPlayers: user._id },
        $inc: { confirmedPlayersCount: 1 }
      }, function(){ console.log("asdnfkalds"); });
    console.log('success');
  });
};

