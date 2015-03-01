var lunr       = require('lunr');
var Handlebars = require('handlebars');
var helpers    = require('../src/helpers');

helpers.register(Handlebars, {});

module.exports = function(grunt) {
  grunt.registerMultiTask('generate_search_index', 'Generate a lunr search index file.', function() {
    var options = this.options();

    var templateSrc = grunt.file.read(options.template);
    var template    = Handlebars.compile(templateSrc);

    var index = lunr(function() {
      this.field('title', {boost: 10});
      this.field('description');
      this.ref('id');
    });

    var docs  = [];

    function addToIndex(data) {
      var id   = data.id + data.type;

      var doc = {
        id:   id,
        html: template(data),
      };

      var search = {
        id:          id,
        title:       data.displayName,
        description: data.description,
      };

      docs.push(doc);
      index.add(search);
    }

    var file = this.files[0];
    var records  = grunt.file.readJSON(file.src);

    _.map(records.pages, function(r) { return r.data; }).forEach(addToIndex);

    grunt.file.write(file.dest, JSON.stringify({
      docs:  docs,
      index: index.toJSON(),
    }));

    grunt.log.writeln("Wrote: " + file.dest);
  });
}
