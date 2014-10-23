'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('prepare_page_data', 'Convert the extracted CA data into something that Assemble.io can use to generate pages.', function() {
    var options = this.options();

    function toPage(file, resource, type) {
      var contents = grunt.file.readJSON(file);
      var id       = /(\d+)\.json/.exec(file)[1];
      var url      = '/' + resource +  '/' + id;
      var partial  = '{{> _' + type + ' this}}';
      var imgSrc   = ((contents.representations || [])[0] || {}).url

      var frontMatter =  {
        url:        url,
        imgSrc:     imgSrc,
        recordType: type
      };

      return {
        data: _.extend(contents, frontMatter),
        content: partial
      };
    }

    function extendRelationship(page, pages, key) {
      if(page.data[key] === undefined) return;

      page.data[key].forEach(function(relationship) {
        var otherPage  = _.detect(pages, function(p) {
          return p.data.id == relationship.id && p.data.recordType == relationship.type;
        });

        var fullRecord = _.extend({}, otherPage.data);
        delete fullRecord.relationships; // prevent circular JSON
        relationship.fullRecord = fullRecord
      });
    }

    function extendRelationships(page, pages) {
      extendRelationship(page, pages, 'relationships');
      extendRelationship(page, pages, 'copyrightHolders');
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
      output[page.data.url] = page;
      output.pages.push(page);
    }

    this.files.forEach(function(file) {
      var objectFiles  = file.src.filter(isObject);
      var entityFiles  = file.src.filter(isEntity);

      var objectPages = objectFiles.map(toObjectPage);
      var entityPages = entityFiles.map(toEntityPage);

      var pages = objectPages.concat(entityPages);

      pages.forEach(function(page) {
        extendRelationships(page, pages);
      });

      pages.forEach(appendToOutput);

      grunt.file.write(file.dest, JSON.stringify(output));
      grunt.log.writeln("Wrote: " + file.dest);
    });
  });
};
