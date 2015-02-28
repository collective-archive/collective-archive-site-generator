window.CA = window.CA || {};

CA.Tabs = function() {
  return {
    selectFirstTab: function() {
      $('.nav-tabs a:first').tab('show');
    }
  };
}();
