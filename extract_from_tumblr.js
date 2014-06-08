'use strict';

var tumblr = require('tumblr');

module.exports = function(grunt) {
  grunt.registerTask('extract_from_tumblr', 'Extract posts from collective archive pgh tumblr.', function() {
    var options = this.options();
    var done = this.async();

    var url = options.url;
    var consumer_key = options.connection.consumer_key;
    var consumer_secret = options.connection.consumer_secret;

    var blog = new tumblr.Blog(url, options.connection.oauth);

    blog.posts(function(error, response) {
      if (error) {
        throw new Error(error);
      }

      console.log(response.posts);
      done();
    });
  })
};
