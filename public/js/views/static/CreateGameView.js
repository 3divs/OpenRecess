var numberArray = [];

var CreateGameView = Marionette.ItemView.extend({
  template: '#create-gameView-template',

  onRender: function() {
    $('.visible').hide("slow");
  },

  events: {
    'click .addphone': function() {
      var value = $('.players').val();
      numberArray.push('+1' + value);
      if ( value.length > 0 && /\d{10}/.test(value) ) {
        $('.players').val('');
      } else {
        return alert("Please enter a valid 10-digit US phone number.");
      }
      $('.invitees').val(numberArray);
      $('.inviteelist').append('<div>+1 (' + value.slice(0,3) + ')' + ' ' + value.slice(3,6) + '-' + value.slice(6,10) + ' </div>');
      if($('.inviteelist').hasClass('hidden')) {
        $('.inviteelist').removeClass('hidden');
      }
    },

    'click .nextbutton': function() {
      if($('.previousbutton').hasClass('buttonhidden')) {
        $('.previousbutton').removeClass('buttonhidden');
      } else if($('.visible').next().hasClass('submit')) {
        $('.nextbutton').addClass('buttonhidden');
      }
      $('.visible').slideToggle("fast").addClass('hidden').removeClass('visible').next().slideToggle("fast").removeClass("hidden").addClass('visible');
    },
    'click .previousbutton': function() {
      if($('.nextbutton').hasClass('buttonhidden')) {
        $('.nextbutton').removeClass('buttonhidden');
      } else if($('.visible').prev().hasClass('what')) {
        $('.previousbutton').addClass('buttonhidden');
      }
      $('.visible').slideToggle("fast").addClass('hidden').removeClass('visible').prev().slideToggle("fast").removeClass("hidden").addClass('visible');
    }
  }
});

