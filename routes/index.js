
/*
 * GET home page.
 */

 var qs = require('querystring');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.sendSMS = function(req, res){
  var accountSid = "AC5933d34eda950c0bb81ed94811a9c13c";
  var authToken = "99143cc9267d4ad6db22cdc12856ad5a";
  var client = require('twilio')(accountSid, authToken);

  var messageContent = "I hate you";
  var toSMS = "+15133074346";
  var fromSMS = "+14159928245";

  client.sms.messages.create({
      body: messageContent,
      to: toSMS,
      from: fromSMS
  }, function(err, message) {
      if (err) {
        console.log('error');
      }
      console.log('Sending SMS to: ' + message.from);
      console.log('Message content: ' + message.body);
      console.log('Status of text message is: ' + message.status);
  });
};

exports.retrieveSMS = function(req, res) {
    var accountSid = 'AC5933d34eda950c0bb81ed94811a9c13c';
    var authToken = "99143cc9267d4ad6db22cdc12856ad5a";
    var client = require('twilio')(accountSid, authToken);
    client.sms.messages.list(function(err, data) {
      console.log(data.sms_messages);
      // data.messages.forEach(function(message) {
      //     console.log(message.To);
      // });
    });
};