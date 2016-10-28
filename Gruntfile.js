'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  /* global process */

  // configures browsers to run test against
  // any of [ 'PhantomJS', 'Chrome', 'Firefox', 'IE']
  var TEST_BROWSERS = ((process.env.TEST_BROWSERS || '').replace(/^\s+|\s+$/, '') || 'PhantomJS').split(/\s*,\s*/g);

  // project configuration
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    config: {
      sources: 'lib',
      tests: 'test',
      dist: '../bower-dmn-js/dist',
      assets: 'assets'
    },

    eslint: {
      check: {
        src: [
          '{lib,test}/**/*.js'
        ]
      },
      fix: {
        src: [
          '{lib,test}/**/*.js'
        ],
        options: {
          fix: true
        }
      }
    },

    release: {
      options: {
        tagName: 'v<%= version %>',
        commitMessage: 'chore(project): release v<%= version %>',
        tagMessage: 'chore(project): tag v<%= version %>'
      }
    },

    karma: {
      options: {
        configFile: '<%= config.tests %>/config/karma.unit.js'
      },
      single: {
        singleRun: true,
        autoWatch: false,

        browsers: TEST_BROWSERS
      },
      unit: {
        browsers: TEST_BROWSERS
      }
    },

    bundle: {
      viewer: {
        name: 'dmn-viewer',
        src: '<%= config.sources %>/Viewer.js',
        dest: '<%= config.dist %>'
      },
      modeler: {
        name: 'dmn-modeler',
        src: '<%= config.sources %>/Modeler.js',
        dest: '<%= config.dist %>'
      }
    },

    less: {
      prod: {
        options: {
          paths: [
            // in order to be able to import "bootstrap/less/**"
            'node_modules'
          ]
        },

        files: { '<%= config.dist %>/css/dmn-js.css': 'styles/dmn-js.less' }
      },
      dev: {
        options: {
          paths: [
            // in order to be able to import "bootstrap/less/**"
            'node_modules'
          ]
        },

        files: { '<%= config.assets %>/css/dmn-js.css': 'styles/dmn-js.less' }
      }
    },

    copy: {
      fonts: {
        files: [
          { expand: true, cwd: 'assets', src: ['dmn-js*'], dest: '<%= config.dist %>/fonts' }
        ]
      },
      diagram_js: {
        files: [
          { expand: true, cwd: 'node_modules/diagram-js/assets', src: [ '**' ], dest: '<%= config.dist %>/assets' }
        ]
      }
    }
  });

  // tasks
  grunt.loadTasks('tasks');

  grunt.registerTask('test', [ 'less:dev', 'karma:single' ]);

  grunt.registerTask('auto-test', [ 'less:dev', 'karma:unit' ]);

  grunt.registerTask('build', [ 'bundle', 'less:prod', 'copy' ]);

  grunt.registerTask('default', [ 'eslint:check', 'test', 'build' ]);
};
