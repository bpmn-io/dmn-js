'use strict';

var TestHelper = require('../TestHelper');


var Viewer = require('../../lib/Viewer');


describe('Viewer', function() {

  var container;

  beforeEach(function() {
    container = jasmine.getEnv().getTestContainer();
  });


  function createViewer(xml, done) {
    var viewer = new Viewer({ container: container });

    viewer.importXML(xml, function(err, warnings) {
      done(err, warnings, viewer);
    });
  }


  it('should import simple process', function(done) {
    var xml = require('../fixtures/dmn/simple.dmn');
    createViewer(xml, done);
  });


  it('should import empty definitions', function(done) {
    var xml = require('../fixtures/dmn/empty-definitions.dmn');
    createViewer(xml, done);
  });


  it('should re-import simple process', function(done) {

    var xml = require('../fixtures/dmn/simple.dmn');

    // given
    createViewer(xml, function(err, warnings, viewer) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      viewer.importXML(xml, function(err, warnings) {

        // then
        expect(err).toBeFalsy();
        expect(warnings.length).toBe(0);

        done();
      });

    });
  });

  describe('defaults', function() {

    it('should use <body> as default parent', function(done) {

      var xml = require('../fixtures/dmn/simple.dmn');

      var viewer = new Viewer();

      viewer.importXML(xml, function(err, warnings) {

        expect(viewer.container.parentNode).toBe(document.body);

        done(err, warnings);
      });
    });

  });


  describe('import events', function() {

    it('should fire <import.*> events', function(done) {

      // given
      var viewer = new Viewer({ container: container });

      var xml = require('../fixtures/dmn/empty-definitions.dmn');

      var events = [];

      viewer.on('import.start', function() {
        events.push('import.start');
      });

      viewer.on('import.success', function() {
        events.push('import.success');
      });

      viewer.on('import.error', function() {
        events.push('import.error');
      });

      // when
      viewer.importXML(xml, function(err) {

        // then
        expect(events).toEqual([
          'import.start',
          'import.success'
        ]);

        done(err);
      });
    });

  });

});
