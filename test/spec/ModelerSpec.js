'use strict';

var TestHelper = require('../TestHelper');


var Modeler = require('../../lib/Modeler');


describe('Modeler', function() {

  var container;

  beforeEach(function() {
    container = jasmine.getEnv().getTestContainer();
  });


  function createModeler(xml, done) {
    var modeler = new Modeler({ container: container, additionalModules: [require('table-js/lib/features/interaction-events')] });

    modeler.importXML(xml, function(err, warnings) {
      done(err, warnings, modeler);
    });
  }


  it('should import simple process', function(done) {
    var xml = require('../fixtures/dmn/simple.dmn');
    createModeler(xml, done);
  });


  it('should import empty definitions', function(done) {
    var xml = require('../fixtures/dmn/empty-definitions.dmn');
    createModeler(xml, done);
  });


  it('should re-import simple process', function(done) {

    var xml = require('../fixtures/dmn/simple.dmn');

    // given
    createModeler(xml, function(err, warnings, modeler) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      modeler.importXML(xml, function(err, warnings) {

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

      var modeler = new Modeler();

      modeler.importXML(xml, function(err, warnings) {

        expect(modeler.container.parentNode).toBe(document.body);

        done(err, warnings);
      });
    });

  });


  describe('import events', function() {

    it('should fire <import.*> events', function(done) {

      // given
      var modeler = new Modeler({ container: container });

      var xml = require('../fixtures/dmn/empty-definitions.dmn');

      var events = [];

      modeler.on('import.start', function() {
        events.push('import.start');
      });

      modeler.on('import.success', function() {
        events.push('import.success');
      });

      modeler.on('import.error', function() {
        events.push('import.error');
      });

      // when
      modeler.importXML(xml, function(err) {

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
