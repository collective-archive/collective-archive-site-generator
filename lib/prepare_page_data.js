'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('prepare_page_data', 'Convert the extracted CA data into something that Assemble.io can use to generate pages.', function() {
    var options    = this.options();
    var slugMapper = require('./slug_mapper')(grunt);

    function toPage(file, resource, type) {
      var contents = grunt.file.readJSON(file);
      var id       = contents.id;
      var url      = slugMapper.urlFor(resource, contents);
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

        relationship.fullRecord = fullRecord;
        relationship.url        = fullRecord.url;
      });
    }

    function extendRelationships(page, pages) {
      extendRelationship(page, pages, 'artists');
      extendRelationship(page, pages, 'relationships');
      extendRelationship(page, pages, 'copyrightHolders');
    }

    function getFeaturedObjects(pages) {
      return _.chain(pages)
        .filter(function(p) { return p.data.imgSrc !== undefined; })
        .filter(function(p) { return p.data.isFeatured; })
        .value();
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

    function isOccurrence(file) {
      return /occurrences/.test(file);
    }

    function toOccurrencePage(file) {
      return toPage(file, 'occurrences', 'occurrence');
    }

    function isCollection(file) {
      return /collections/.test(file);
    }

    function toCollectionPage(file) {
      return toPage(file, 'collections', 'collection');
    }

    var output = {
      pages: [],
      featuredObjects: []
    };

    function appendToOutput(page) {
      output[page.data.url] = page;
      output.pages.push(page);
    }

    this.files.forEach(function(file) {
      var objectFiles     = file.src.filter(isObject);
      var entityFiles     = file.src.filter(isEntity);
      var occurrenceFiles = file.src.filter(isOccurrence);
      var collectionFiles = file.src.filter(isCollection);

      var objectPages     = objectFiles.map(toObjectPage);
      var entityPages     = entityFiles.map(toEntityPage);
      var occurrencePages = occurrenceFiles.map(toOccurrencePage);
      var collectionPages = collectionFiles.map(toCollectionPage);

      var pages = objectPages.concat(entityPages).concat(occurrencePages).concat(collectionPages);

      pages.forEach(function(page) {
        extendRelationships(page, pages);
      });

      pages.forEach(appendToOutput);

      output.featuredObjects = getFeaturedObjects(objectPages);

      grunt.file.write(file.dest, JSON.stringify(output));
      grunt.log.writeln("Wrote: " + file.dest);
    });

    slugMapper.write();
  });
};
