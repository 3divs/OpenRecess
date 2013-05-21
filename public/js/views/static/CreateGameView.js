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
    },
    'click #createGameAndSend': 'createGame'
  },

  displayErrors: function(className, html) {
    var $form = this.$('form');
    $form.find('.alert').remove();
    $form.prepend('\
      <div class="alert ' + className + '" id="alert">' +
        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
          html +
      '</div>'
    );
  },

  createGame: function(e) {
    e.preventDefault();
    var params = {};
    _.each(this.$('.input-field'), function(input) {
      // console.log(input.name + ' - ' + $(input).val());
      params[input.name] = $(input).val();
    });

    this.model.set(params);
    var that = this;
    this.model.save(null, {
      error: function(model, response, options) {
        that.displayErrors('alert-error', response.responseText) ;
        // console.log('error - ', response.responseText);
      },
      success: function(model, response, options) {
        that.displayErrors('alert-success', 'SUCCESS! Game created!');
        // console.log('Success creating game - ', response);
        $.ajax('/send-sms/' + response.gameId, {
          success: function(response) {
            console.log('sent sms - ', response);
          },
          error: function(err) {
            console.log('error - ', err);
          }
        });
        that.$('.input-field').val('');
      }
    });
  }
});

