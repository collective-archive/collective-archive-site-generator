'use strict';

var path         = require('path');
var extractor    = require('collective-access-extractor');
var transformers = require('./transformers');

module.exports = function(grunt) {
  grunt.registerTask('fetch_raw_record', "Fetch raw record from CA", function(type, id) {
    var options = this.options();
    var done    = this.async();
    var batch   = {
      entities: [],
      objects:  []
    };

    if (type == "entity") {
      batch.entities = [id];
    }
    else if (type == "object") {
      batch.objects = [id];
    }

    var printItem = function(err, id, type, data) {
      console.log(JSON.stringify(data, null, 2));
    };

    extractor.fetchBatch(options.connection, batch, printItem, function() { done(); });
  });

  grunt.registerTask('extract_from_archive', 'Extract the raw data from Collective Archive.', function() {
    var options = this.options();
    var done    = this.async();

    extractor.fetchAllRecords(options.connection, function(err, id, type, data) {
      if(err) {
        grunt.log.warn("Error fetching " + type + " with id: " + id);
        return;
      }

      buildRecord(type, data, options.dest);
    }, done);
  });

  function buildRecord(type, data, dest) {
    if(type === 'object') {
      var transformed = transformers.transformObject(data);
      buildObject(transformed, dest);
    }

    if(type === 'entity') {
      var transformed = transformers.transformEntity(data);
      buildEntity(transformed, dest);
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
