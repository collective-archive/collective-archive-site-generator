'use strict';
module.exports = function(grunt) {
  require("time-grunt")(grunt);
  require("load-grunt-tasks")(grunt);
  require("./prepare_page_data")(grunt);

  function readJsonData(name) {
    var filename = './src/data/' + name + '.json';

    if (!grunt.file.exists(filename)) {
      return '{}';
    }

    return grunt.file.readJSON(filename);
  };

  grunt.initConfig({
    prepare_page_data: {
      options: {
      },
      records: {
        files: {
          './src/data/records.json': [ './src/data/records/**/*.json' ],
        }
      }
    },

    assemble: {
      options: {
        layout: './src/templates/layout.hbs',
        partials: ['./src/templates/**/*.hbs' ],
        helpers: './src/helpers.js',
      },
      index: {
        options: {
          flatten: true,
          data:  './src/data/records.json'
        },
        files: {
          'dist/': [ './src/templates/index.hbs'],
        }
      },
      records: {
        options: {
          collections: [{name: 'records'}],
          pages: readJsonData('records')
        },
        files: {
          'dist/': [],
        }
      },
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
  grunt.loadNpmTasks('assemble');
}
