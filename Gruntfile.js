'use strict';

var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

module.exports = function(grunt) {
  require("time-grunt")(grunt);
  require("load-grunt-tasks")(grunt);
  require("./lib/extract_from_archive")(grunt);
  require("./lib/prepare_page_data")(grunt);
  require("./lib/generate_search_index")(grunt);
  require("./lib/extract_from_tumblr")(grunt);

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

    fetch_raw_record: {
      options: {
        connection: {
          url:      'http://archive.collectivearchivepgh.org/',
          username: 'api',
          password: 'api123'
        },
      },
    },

    extract_from_tumblr: {
      options: {
        url:   'collectivearchivepgh.tumblr.com',
        connection: {
          oauth: {
            consumer_key:    'vYEpk5OoqPTCijurmqs3RuaB6IdcAxLtRssEAPC6scyzE1FY3w',
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
        },
        search: './dist/search_index.json'
      }
    },

    generate_search_index: {
      options: {
        template: './src/templates/_search_result.hbs'
      },
      search: {
        files: {
          './dist/search_index.json': ['./src/data/records.json'],
        },
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
            './src/templates/about.hbs',
            './src/templates/contact.hbs',
            './src/templates/search.hbs',
          ],
        }
      },
      index: {
        options: {
          layout: './src/templates/index_layout.hbs',
          flatten: true,
          data:  './src/data/records.json'
        },
        files: {
          'dist/': [
            './src/templates/index.hbs',
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
        cwd:  'src',
        src:  [
         'scripts/vendor/*',
         'styles/vendor/*',
         'assets/images/*'
        ],
        dest: 'dist/',
      },
      favicon: {
        src:  'src/assets/images/favicon.ico',
        dest: 'dist/favicon.ico',
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
        '(.*).css': '$1.css',
        '(.*).jpg': '$1.jpg',
        '(.*).png': '$1.png',
        '(.*).gif': '$1.gif',
        '(.*).js': '$1.js',
        '(.*).ico': '$1.ico',
        '/search\?(.*)': '/search.html\?$1',
        '(.*)(?!\.html)': '$1.html',
      },
      dev: {}
    },

    watch: {
      assemble: {
        files: ["src/**/*.hbs", "!src/templates/_search_result.hbs", "!src/templates/index.hbs"],
        tasks: ["assemble"]
      },

      index: {
        files: ["src/templates/index.hbs"],
        tasks: ["assemble:index"]
      },

      search: {
        files: ["src/templates/_search_result.hbs"],
        tasks: ["generate_search_index"]
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
  grunt.registerTask('spec',   ['jasmine_node']);
  grunt.registerTask('serve',   ['configureRewriteRules', 'connect:dev', 'watch']);
  grunt.registerTask('build',   ['prepare_page_data', 'generate_search_index', 'assemble', 'sass', 'copy:dist', 'copy:favicon', 'concat']);
  grunt.registerTask('extract_and_build', ['extract_from_archive', 'extract_from_tumblr', 'build']);
  grunt.registerTask('default', ['extract_and_build', 'serve']);
}
