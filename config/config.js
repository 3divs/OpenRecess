var config = {};

config.db = {};

config.db = process.env['MONGOLAB_URI'] || 'mongodb://localhost:17017/openRecess';
config.port = process.env.PORT || 5000;

config.twilioSID = process.env.TWILIO_ACCOUNT_SID || '1234';
config.twilioAuth = process.env.TWILIO_AUTH_TOKEN || '1234';
config.twilioNumber = '+14248887537';

module.exports = config;
