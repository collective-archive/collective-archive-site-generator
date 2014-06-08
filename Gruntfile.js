'use strict';

var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

module.exports = function(grunt) {
  require("time-grunt")(grunt);
  require("load-grunt-tasks")(grunt);
  require("./extract_from_archive")(grunt);
  require("./prepare_page_data")(grunt);
  grunt.initConfig({
    extract_from_archive: {
      options: {
        connection: {
          url:      'http://archive.collectivearchivepgh.org/',
          username: 'api',
          password: 'api123'
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
      static_pages: {
        options: {
          flatten: true,
          data:  './src/data/records.json'
        },
        files: {
          'dist/': [
            './src/templates/index.hbs',
            './src/templates/about.hbs',
            './src/templates/testimonials.hbs',
            './src/templates/contact.hbs'
          ],
        }
      },
      records: {
        options: {
          pageSource: './src/data/records.json'
        },
        files: {
          'dist/': [],
        }
      },
    },

    copy: {
      dist: {
        expand: true,
        cwd:  'src/scripts/vendor',
        src:  '*',
        dest: 'dist/scripts/vendor/',
      }
    },

    concat: {
      dist: {
        src: [
          './src/scripts/**/*.js',
          '!./src/scripts/vendor/**/*.js'
        ],
        dest: './dist/scripts/main.js'
      }
    },

    sass: {
      options: {
        includePaths: [ './src/bower_components' ]
      },
      dist: {
        files: {
          './dist/styles/main.css': './src/styles/main.scss'
        }
      }
    },

    connect: {
      options: {
        port: 8000,
        livereload: 35730,
        hostname: "0.0.0.0",
        base: ["./dist"],
        middleware: function(connect, options) {
          return [rewriteRulesSnippet, connect["static"](require("path").resolve("./dist"))];
        }
      },
      rules: {
        '^/$': '/index.html',
        '(.*)(?!\.html|\.jpg|\.css)': '$1.html'
      },
      dev: {}
    },

    watch: {
      assemble: {
        files: ["src/**/*.hbs"],
        tasks: ["assemble"]
      },

      concat: {
        files: ["src/**/*.js"],
        tasks: ["concat:dist"]
      },

      sass: {
        files: ["src/**/*.{scss,sass}"],
        tasks: ["sass:dist"]
      },

      dev: {
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
  grunt.registerTask('serve',   ['configureRewriteRules', 'connect:dev', 'watch']);
  grunt.registerTask('default', ['extract_from_archive',  'prepare_page_data', 'assemble', 'sass', 'copy', 'concat']);
}
