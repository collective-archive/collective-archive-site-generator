var _             = require('underscore');
var getSlug       = require('speakingurl');
var SLUG_MAP_FILE = "src/data/slug_map.json";

module.exports = function(grunt) {

  function readMap() {
    try {
      return grunt.file.readJSON(SLUG_MAP_FILE);
    }
    catch (e) {
      return {};
    }
  }

  var contents = readMap();

  function sluggify(resource, record, salt) {
    salt = salt || ''; //used to break ties

    return '/' + getSlug(record.displayName) + salt;
  }

  function slugExists(slug) {
    return _.any(contents, function(val) { return val === slug; });
  }

  function urlFor(resource, record) {
    var key  = resource +  '|' + record.id;

    if(!contents[key]) {
      var slug = sluggify(resource, record);

      // just in case there is a collision, tack on the id as a tiebreaker
      if(slugExists(slug)) {
        slug = sluggify(resource, record, record.id);
      }

      contents[key] = slug;
    }

    return contents[key];
  }

  function write() {
    grunt.file.write(SLUG_MAP_FILE, JSON.stringify(contents));
  }

  return {
    urlFor: urlFor,
    write:  write,
  };
}
