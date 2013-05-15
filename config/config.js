var config = {};

config.db = {};

config.db = process.env['MONGOLAB_URI'];  //|| 'mongodb://localhost:17017/openRecess';
config.port = process.env.PORT || 5000;

module.exports = config;
