'use strict';
module.exports = function(grunt) {
  require("time-grunt")(grunt);
  require("load-grunt-tasks")(grunt);
  require("./extract_from_archive")(grunt);
  require("./prepare_page_data")(grunt);

  function readJsonData(name) {
    var filename = './src/data/' + name + '.json';

    if (!grunt.file.exists(filename)) {
      return '{}';
    }

    return grunt.file.readJSON(filename);
  };

  grunt.initConfig({
    extract_from_archive: {
      options: {
        connection: {
          url:      'http://archive.collectivearchivepgh.org/',
          username: 'api',
          password: 'api123'
        },
        records: {
          objects:  [1, 2, 3],
          entities: [2, 3, 4]
        },
        dest: './src/data/records'
      },
    },

    prepare_page_data: {
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
          pages: readJsonData('records')
        },
        files: {
          'dist/': [],
        }
      },
    },

    compass: {
      options: {
        require: ["sass-globbing", "bootstrap-sass"],
        bundleExec: true,
        sassDir: "src/styles",
        cssDir: "dist/styles",
        javascriptsDir: "src/scripts",
        relativeAssets: false,
        outputStyle: "expanded",
        importPath: "src/bower_components",
        raw: "extensions_dir = \"src/bower_components\"\n"
      },
      dist: {}
    },

    connect: {
      options: {
        port: 8000,
        livereload: 35730,
        hostname: "0.0.0.0",
        base: [
          "./dist"
        ]
      },
      livereload: {}
    },

    watch: {
      compass: {
        files: ["src/styles/**/*.{scss,sass}"],
        tasks: ["compass:dist"]
      },
      livereload: {
        options: {
          livereload: "<%= connect.options.livereload %>"
        },
        files: [
          "./dist/**/*.html",
          "./dist/**/*.css",
          "./dist/**/*.js",
          "./dist/**/*.{png,jpg,jpeg,gif,webp,svg}"
        ]
      }
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
  grunt.loadNpmTasks('assemble');
  grunt.registerTask('serve',   ['connect:livereload', 'watch']);
  grunt.registerTask('default', ['extract_from_archive', 'prepare_page_data', 'compass']);
}
