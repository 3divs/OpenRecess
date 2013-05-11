var HeaderView = Marionette.ItemView.extend({
  template: '#headerView-template',
  model: User,

  events: {
    'click a': 'highlightMenu'
  },

  initialize: function() {
    this.model.on('change', this.render);
  },

  highlightMenu: function(link) {
    // console.log('link selected: ', $(link)[0].target);

    // Highlight link
    this.$el.find('li.active').removeClass('active');
    $(link.currentTarget).closest('li').addClass('active');
  }
});