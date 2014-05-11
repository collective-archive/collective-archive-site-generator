'use strict';

var _ = require('underscore');

module.exports = function(grunt) {
  grunt.registerMultiTask('prepare_data', 'Convert the extracted CA data into something that Assemble.io can use to generate pages.', function() {
    var options = this.options();

    function isEntity(file) {
      return /entities/.test(file);
    }

    function toEntityPage(file) {
      var contents = grunt.file.readJSON(file);
      var id       = /(\d+)\.json/.exec(file)[1];

      var page = {};

      page['/entities/' + id] = {
        data: {},
        content: '{{> _entity this}}'
      };

      return page;
    }

    function isObject(file) {
      return /objects/.test(file);
    }

    function toObjectPage(file) {
      var contents = grunt.file.readJSON(file);
      var id       = /(\d+)\.json/.exec(file)[1];

      var page = {};

      page['/objects/' + id] = {
        data: {},
        content: '{{> _object this}}'
      };

      return page;
    }

    var output = {};

    function appendToOutput(page) {
      _.extend(output, page);
    }

    this.files.forEach(function(file) {
      var objectFiles  = file.src.filter(isObject);
      var entityFiles  = file.src.filter(isEntity);

      var objectPages = objectFiles.map(toObjectPage);
      var entityPages = entityFiles.map(toEntityPage);

      objectPages.forEach(appendToOutput);
      entityPages.forEach(appendToOutput);

      grunt.file.write(file.dest, JSON.stringify(output));
      grunt.log.writeln("Wrote: " + file.dest);
    });
  });
};
