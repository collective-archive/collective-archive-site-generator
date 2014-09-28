window.Tabs = function() {
  return {
    selectFirstTab: function() {
      $('.nav-tabs a:first').tab('show');
    }
  };
}();
