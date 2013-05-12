var numberArray = [];

var CreateGameView = Marionette.ItemView.extend({
  template: '#create-gameView-template',

  events: {
    'click .icon-plus': function() {
      var value = $('.players').val();
      numberArray.push('+1' + value);
      if ( value.length > 0 && /\d{10}/.test(value) ) {
        $('.players').val('');
      } else {
        return alert("Please enter a valid 10-digit US phone number.");
      }
      $('.invitees').val(numberArray);
      $('.inviteeList').append('<div>+1 (' + value.slice(0,3) + ')' + ' ' + value.slice(3,6) + '-' + value.slice(6,10) + ' </div>');
    }

  }

});

