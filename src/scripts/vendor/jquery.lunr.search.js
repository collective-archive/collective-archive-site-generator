(function($) {

  var debounce = function(fn) {
    var timeout;
    var slice = Array.prototype.slice;

    return function() {
      var args = slice.call(arguments),
          ctx = this;

      clearTimeout(timeout);

      timeout = setTimeout(function () {
        fn.apply(ctx, args);
      }, 100);
    };
  };

  var LunrSearch = (function() {
    function LunrSearch(elem, options) {
      this.$elem = elem;
      this.$results = $(options.results);
      this.$entries = $(options.entries, this.$results);
      this.indexDataUrl = options.indexUrl;
      this.render   = options.render;

      this.initialize();
    }

    LunrSearch.prototype.initialize = function() {
      var self = this;

      this.loadIndexData(function(data) {
        self.entries = self.createEntries(data.docs);
        self.index = lunr.Index.load(data.index);
        self.populateSearchFromQuery();
        self.bindKeypress();
      });
    };

    // load the search index data
    LunrSearch.prototype.loadIndexData = function(callback) {
      $.getJSON(this.indexDataUrl, callback);
    };

    LunrSearch.prototype.createEntries = function(rawEntries) {
      var entries = {};

      $.each(rawEntries, function(_, entry) {
        entries[entry.id] = entry;
      });

      return entries;
    };

    LunrSearch.prototype.bindKeypress = function() {
      var self = this;
      var oldValue = this.$elem.val();

      this.$elem.bind('keyup', debounce(function() {
        var newValue = self.$elem.val();
        if (newValue !== oldValue) {
          self.search(newValue);
        }

        oldValue = newValue;
      }));
    };

    LunrSearch.prototype.search = function(query) {
      var entries = this.entries;

      if (query.length < 3) {
        this.$results.hide();
        this.$entries.empty();
      } else {
        var results = $.map(this.index.search(query), function(result) {
          return entries[result.ref];
        });

        this.displayResults(results);
      }
    };

    LunrSearch.prototype.displayResults = function(entries) {
      var $entries = this.$entries,
          $results = this.$results;

      $entries.empty();

      if (entries.length === 0) {
        $entries.append('<p>Nothing found.</p>');
      } else {
        $entries.append(this.render(entries));
      }

      $results.show();
    };

    // Populate the search input with 'q' querystring parameter if set
    LunrSearch.prototype.populateSearchFromQuery = function() {
      var queryString = deparam(window.location.search.toString().replace('?', ''));

      if (queryString.hasOwnProperty('q')) {
        this.$elem.val(queryString.q);
        this.search(queryString.q.toString());
      }
    };

    return LunrSearch;
  })();

  $.fn.lunrSearch = function(options) {
    // apply default options
    options = $.extend({}, $.fn.lunrSearch.defaults, options);

    // create search object
    new LunrSearch(this, options);

    return this;
  };

  $.fn.lunrSearch.defaults = {
    indexUrl  : '/js/index.json',   // Url for the .json file containing search index data
    results   : '#search-results',  // selector for containing search results element
    entries   : '.entries',         // selector for search entries containing element (contained within results above)
    render    : function(entries) { console.log(entries); },
  };
})(jQuery);
