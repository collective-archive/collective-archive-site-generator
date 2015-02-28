window.CA = window.CA || {};

CA.Search = function() {
  return {
    init: function() {
      window.tipuesearch = {"pages": [
           {"title": "Tipue Search, a site search engine jQuery plugin", "text": "Tipue Search is a site search engine jQuery plugin. Tipue Search is open source and released under the MIT License, which means it's free for both commercial and non-commercial use. Tipue Search is responsive and works on all reasonably modern browsers.", "tags": "JavaScript", "loc": "http://www.tipue.com/search"},
           {"title": "Tipue drop, a search suggestion box jQuery plugin", "text": "Tipue drop is a search suggestion box jQuery plugin. Tipue drop is open source and released under the MIT License, which means it's free for both commercial and non-commercial use. Tipue drop is responsive and works on all reasonably modern browsers.", "tags": "JavaScript", "loc": "http://www.tipue.com/drop"},
           {"title": "About Tipue", "text": "Tipue is a small web development studio based in North London. We've been around for over a decade.", "tags": "", "loc": "http://www.tipue.com/about"}
      ]};

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

      $('#tipue_search_input').tipuesearch();
    }
  };
}();

