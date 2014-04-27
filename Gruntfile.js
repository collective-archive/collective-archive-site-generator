'use strict';
module.exports = function(grunt) {
  // Show elapsed time after tasks run
  require("time-grunt")(grunt);
  // Load all Grunt tasks
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({

    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
      },
      all: ['spec/']
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:collective-archive/collective-archive.github.io.git',
          branch: 'master'
        }
      }
    }
  });
  grunt.registerTask('default', ['jasmine_node'])
}
