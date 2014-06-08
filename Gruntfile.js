'use strict';
module.exports = function(grunt) {
  require("time-grunt")(grunt);
  require("load-grunt-tasks")(grunt);
  require("./extract_from_archive")(grunt);
  require("./prepare_page_data")(grunt);
  require("./extract_from_tumblr")(grunt);

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

    extract_from_tumblr: {
      options: {
        url:   'collectivearchivepgh.tumblr.com',
        connection: {
          oauth: { consumer_key:    'vYEpk5OoqPTCijurmqs3RuaB6IdcAxLtRssEAPC6scyzE1FY3w',
                  consumer_secret: 'uyvjz543QtiDc1poKLu7EnPUauwTQfd0ALjtUimHkePMEdksE6',
          }
        },
        dest: './src/data/tumblr_posts.json'
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
            './src/templates/index.hbs'
          ],
        }
      },
      testimonials: {
        options: {
          flatten: true,
          data:  './src/data/tumblr_posts.json'
        },
        files: {
          'dist/': [
            './src/templates/testimonials.hbs'
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
        base: [
          "./dist"
        ]
      },
      livereload: {}
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
  grunt.registerTask('default', ['extract_from_archive', 'extract_from_tumblr', 'prepare_page_data', 'assemble', 'sass', 'copy', 'concat']);
}
