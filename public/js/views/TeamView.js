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
  },

  deleteTeam: function() {
    var that = this;
    if(confirm('Delete Team. Are you sure?')) {
      this.$el.fadeOut(this.transitionTime, function() {
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
      // Re render model
      // this.render();
    }
  },

  editRosterPlayer: function(e) {
    // Store temp local player names
    var $node = $(e.target).closest('li.roster-player');
    var name = $(e.target).data('name');
    var phone = $(e.target).data('phone');

    // Replace li with inline-form
    var html = '<form><input class="input-small" type="text" name="name" value="' + name + '"/> - ' +
               '<input class="input-small" type="text" name="phone" value="' + phone + '"/></form>';
    $node.html(html);
  },

  deleteRosterPlayer: function(e) {
    console.log(e.target);
    $(e.target).closest('li.roster-player').fadeOut(this.transitionTime);
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
    console.log('show details');
    this.$('.details').slideToggle(this.transitionTime);
  },

  onRender: function() {
    // Hide the details
    this.$('.details').hide();
    this.$('.sms-form').hide();
    this.$('.new-roster-player').hide();
  }
});
