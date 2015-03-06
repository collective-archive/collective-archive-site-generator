var SLUG_MAP_FILE = "src/data/slug_map.json"

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

  function sluggify(resource, record) {
    return '/' + resource +  '/' + record.id;
  }

  function urlFor(resource, record) {
    var key = resource +  '|' + record.id;

    if(!contents[key]) {
      contents[key] = sluggify(resource, record);
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
