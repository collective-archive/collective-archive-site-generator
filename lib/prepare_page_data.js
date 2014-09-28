'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('prepare_page_data', 'Convert the extracted CA data into something that Assemble.io can use to generate pages.', function() {
    var options = this.options();

    function toPage(file, resource, partial) {
      var contents = grunt.file.readJSON(file);
      var id       = /(\d+)\.json/.exec(file)[1];
      var url      = '/' + resource +  '/' + id;
      var partial  = '{{> _' + partial + ' this}}';
      var imgSrc   = ((contents.representations || [])[0] || {}).url
      var frontMatter =  {
        name:   contents.displayName,
        url:    url,
        imgSrc: imgSrc
      };

      return {
        frontMatter: frontMatter,
        data: _.extend(contents, {frontMatter: frontMatter}),
        content: partial
      };
    }

    function isEntity(file) {
      return /entities/.test(file);
    }

    function toEntityPage(file) {
      return toPage(file, 'entities', 'entity');
    }

    function isObject(file) {
      return /objects/.test(file);
    }

    function toObjectPage(file) {
      return toPage(file, 'objects', 'object');
    }

    var output = {
      pages: []
    };

    function appendToOutput(page) {
      output[page.frontMatter.url] = page;
      output.pages.push(page.frontMatter);
    }

    this.files.forEach(function(file) {
      var objectFiles  = file.src.filter(isObject);
      var entityFiles  = file.src.filter(isEntity);

      objectFiles.map(toObjectPage).forEach(appendToOutput);
      entityFiles.map(toEntityPage).forEach(appendToOutput);

      grunt.file.write(file.dest, JSON.stringify(output));
      grunt.log.writeln("Wrote: " + file.dest);
    });
  });
};
