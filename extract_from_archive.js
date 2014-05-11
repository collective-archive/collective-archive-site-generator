'use strict';

var path = require('path');
var extractor = require('collective-access-extractor');

module.exports = function(grunt) {
  grunt.registerTask('extract_from_archive', 'Extract the raw data from Collective Archive.', function() {
    var options = this.options();
    var done    = this.async();

    extractor.fetchBatch(options.connection, options.records, function(err, id, type, data) {
      if(err) {
        grunt.log.warn("Error fetching " + type + " with id: " + id);
        return;
      }

      buildRecord(type, data, options.dest);
    }, done);
  });

  function buildRecord(type, data, dest) {
    if(type === 'object') {
      buildObject(data, dest);
    }

    if(type === 'entity') {
      buildEntity(data, dest);
    }
  }

  function buildObject(data, dest) {
    var filename = dest + '/objects/' + data.id + '.json';
    writeFile(filename, data);
  }

  function buildEntity(data, dest) {
    var filename = dest + '/entities/' + data.id + '.json';
    writeFile(filename, data);
  }

  function writeFile(filename, data) {
    var json = JSON.stringify(data);
    grunt.file.mkdir(path.dirname(filename));
    grunt.file.write(filename, json);
    grunt.log.writeln('Wrote: ' + filename);
  }
};