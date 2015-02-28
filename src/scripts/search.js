window.CA = window.CA || {};

CA.Search = function() {
  return {
    init: function() {
      $('#search-input').lunrSearch({
        indexUrl: '/search_index.json',
        results : '#search-results',
        entries : '.entries',
        template: '#search-results-template'
      });
    }
  };
}();

