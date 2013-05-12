var Game = Backbone.Model.extend({
  url: '/game',

  initialize: function() {

    this.validators = {};

    this.validators.gameName = function(value) {
      return value.length > 0 ? {isValid: true} : {isValid: false, message: "Give your game a name dude!"};
    };

    this.validators.gameDate = function(value) {
      return value > 0 && /^\d{1,2}\/\d{1,2}\/\d{4}$/ ? {isValid: true} : {isValid: false, message: "What time is game time baby!"};
    };

    this.validators.gameTime = function(value) {
      return value > 0 && /^\d{1,2}:\d{2}([ap]m)?$/ ? {isValid: true} : {isValid: false, message: "What time is game time baby!"};
    };

    this.validators.gameType = function(value) {
      return value.length > 0 ? {isValid: true} : {isValid: false, message: "Let the people know what they will be playing."};
    };

    this.validators.location = function(value) {
      return value.length > 0 ? {isValid: true} : {isValid: false, message: "The field, the court, your driveway? Where we ballin'?"};
    };

    this.validators.minimumPlayers = function(value) {
      return value > 0 ? {isValid: true} : {isValid: false, message: "I know you aren't playing by yourself, or are you a one person show?"};
    };

    this.validators.playerLimit = function(value) {
      return value > 0 ? {isValid: true} : {isValid: false, message: "What is this a family reunion, let's put a cap on the team size shall we?"};
    };

    this.validators.players = function(value) {
      return value.length > 0 ? {isValid: true} : {isValid: false, message: "" /* Field needs to be changed */ };
    };

  }

});
