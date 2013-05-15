var TeamView = Marionette.ItemView.extend({
  model: Team,
  template: '#teamView-template',
  className: 'span5 team',

  events: {
    'click .title': 'showDetails',
    'click #createSms': 'showSmsForm',
    'click #sendSms': 'sendSms',
    'click #cancelSms': 'cancelSms',
    'click .fui-new-16': 'editRosterPlayer',
    'click .fui-cross-16': 'deleteRosterPlayer',
    'click #add-player': 'addRosterPlayer',
    'keypress form': 'submitRosterPlayer',
    'click #deleteTeam': 'deleteTeam'
  },

  initialize: function() {
    this.transitionTime = 500;
    this.bind('change:roster', this.render);
  },

  deleteTeam: function() {
    var that = this;
    if(confirm('Delete Team. Are you sure?')) {
      this.$el.fadeOut(this.transitionTime, function() {
        that.model.set('url', '/teams/' + that.model.get('_id'));
        that.model.destroy();
      });
    }
  },

  addRosterPlayer: function() {
    this.$('.new-roster-player').slideDown();
  },

  submitRosterPlayer: function(e) {
    // Check whether enter was pressed
    if(e.which === 13) {
      this.$(e.target).closest('form').slideUp(this.transitionTime);

      // Save data to model
      var $node = $(e.target).closest('form');
      var name = $node.find('input[name="name"]').val();
      var phone = $node.find('input[name="phone"]').val();
      if($node.hasClass('add-player'))
        this.model.addRosterPlayer(name, phone);
      else
        this.model.editRosterPlayer(name, phone);

      this.render();
    }
  },

  editRosterPlayer: function(e) {
    // Store temp local player names
    var $node = $(e.target).closest('li.roster-player');
    var name = $(e.target).data('name');
    var phone = $(e.target).data('phone');

    // Replace li with inline-form
    var html = '<form class="edit-player"><input class="input-small" type="text" name="name" value="' + name + '"/> - ' +
               '<input class="input-small" type="text" name="phone" value="' + phone + '"/></form>';
    $node.html(html);
  },

  deleteRosterPlayer: function(e) {
    $elm = $(e.target);
    $(e.target).closest('li.roster-player').fadeOut(this.transitionTime);
    this.model.deleteRosterPlayer($elm.data('name'), $elm.data('phone'));
  },

  showSmsForm: function(e) {
    this.$('#createSms').hide();
    this.$('.details').slideDown(this.transitionTime);
    this.$('.sms-form').fadeIn(this.transitionTime);
  },

  hideSmsForm: function() {
    this.$('.sms-form').fadeOut(this.transitionTime);
    this.$('#createSms').show();
  },

  sendSms: function(e) {
    this.hideSmsForm();
  },

  cancelSms: function(e) {
    this.hideSmsForm();
  },

  showDetails: function(e) {
    this.$('.details').slideToggle(this.transitionTime);
  },

  onRender: function() {
    // Hide the details
    this.$('.details').hide();
    this.$('.sms-form').hide();
    this.$('.new-roster-player').hide();
  }
});
