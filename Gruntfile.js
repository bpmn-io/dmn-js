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
      dist: 'dist'
    },

    jshint: {
      src: [
        ['<%=config.sources %>']
      ],
      options: {
        jshintrc: true
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
      options: {
        paths: [
          // in order to be able to import "bootstrap/less/**"
          'node_modules'
        ]
      },

      styles: {
        files: { 'dist/css/dmn-js.css': 'styles/dmn-js.less' }
      }
    },

    copy: {
      fonts: {
        files: [
          {expand: true, cwd: 'fonts', src: ['dmn-js*'], dest: '<%= config.dist %>/fonts'},
        ]
      }
    },

    jsdoc: {
      dist: {
        src: [ '<%= config.sources %>/**/*.js' ],
        options: {
          destination: 'docs/api',
          plugins: [ 'plugins/markdown' ]
        }
      }
    }
  });
  // tasks
  grunt.loadTasks('tasks');

  grunt.registerTask('test', [ 'karma:single' ]);

  grunt.registerTask('auto-test', [ 'karma:unit' ]);

  grunt.registerTask('build', [ 'bundle', 'less', 'copy:fonts' ]);

  grunt.registerTask('default', [ 'jshint', 'test', 'build', 'jsdoc' ]);
};
