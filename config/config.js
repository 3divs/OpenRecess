var config = {};

config.db = {};

config.db = process.env['MONGOLAB_URI'] || 'mongodb://localhost:17017/openRecess';
config.port = process.env.PORT || 5000;

config.twilioSID = process.env.TWILIO_ACCOUNT_SID;
config.twilioAuth = process.env.TWILIO_AUTH_TOKEN;
config.twilioNumber = '+14248887537';

module.exports = config;
