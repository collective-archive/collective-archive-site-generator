window.CA = window.CA || {};

CA.Search = function() {
  return {
    init: function() {
      window.tipuesearch_stop_words = [
        "and", "be", "by", "do", "for",
        "he", "how", "if", "is", "it",
        "my", "not", "of", "or", "the",
        "to", "up", "what", "when"
      ];

      window.tipuesearch_replace = {
        "words": [
         {"word": "javscript", "replace_with": "javascript"}
      ]};

      window.tipuesearch_stem = {
        "words": [
         {"word": "e-mail", "stem": "email"},
      ]};

      $('#tipue_search_input').tipuesearch({
        mode: 'json',
        contentLocation: '/scripts/search_content.json'
      });
    }
  };
}();

