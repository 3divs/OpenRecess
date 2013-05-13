var TeamView = Marionette.ItemView.extend({
  model: Team,
  template: '#teamView-template',
  className: 'team',

  events: {
    'click .name': 'showDetails',
    'click #createSms': 'showSmsForm',
    'click #sendSms': 'sendSms',
    'click #cancelSms': 'cancelSms'
  },

  initialize: function() {
    // this.
  },

  showSmsForm: function(e) {
    this.$('#createSms').hide();
    this.$('.details').slideDown(500);
    this.$('.sms-form').fadeIn(500);
  },

  hideSmsForm: function() {
    this.$('.sms-form').fadeOut(500);
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
    this.$('.details').slideToggle(500);
  },

  onRender: function() {
    // Hide the details
    this.$('.details').hide();
    this.$('.sms-form').hide();
  }
});
