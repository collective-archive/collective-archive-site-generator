'use strict';
module.exports = function(grunt) {
  require("time-grunt")(grunt);
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({

    assemble: {
      options: {
      },
      content: {
        options: {
          layout: './templates/layout.hbs',
          partials: ['./templates/**/*.hbs' ],
          helpers: './helpers/**/*.js',
          pages: {
            '/entities/1':  {
              data: { 
                displayName: 'Entity',
                addresses: [ { address1: 'Address 1 - Entity' } ],
                relationships: [ { type: 'object', id: 1, label: 'object' } ]
              },
              content: '{{> _entity this }}'
            },
            '/objects/1':  {
              data: { 
                displayName: 'Object',
                addresses: [ { address1: 'Address 1 - Object' } ],
                relationships: [ { type: 'entity', id: 1, label: 'entity' } ],
                measurements: {
                  height: '10 cm',
                  width: '30 cm'
                }
              },
              content: '{{> _object this }}'
            }
          }
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
