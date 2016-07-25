'use strict';

var Viewer = require('../../lib/Viewer');

var simpleXML = require('../fixtures/dmn/simple.dmn'),
    emptyDefsXML = require('../fixtures/dmn/empty-definitions.dmn'),
    emptyDecisionXML = require('../fixtures/dmn/empty-decision-id.dmn'),
    noDecisionXML = require('../fixtures/dmn/no-decision-id.dmn');

describe('Viewer', function() {

  var container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    container.parentNode.removeChild(container);
  });


  function createViewer(xml, done) {
    var viewer = new Viewer({ container: container });

    viewer.importXML(xml, function(err, warnings) {
      done(err, warnings, viewer);
    });
  }


  it('should import simple process', function(done) {
    createViewer(simpleXML, done);
  });


  it('should import empty definitions', function(done) {
    createViewer(emptyDefsXML, done);
  });

  it('should import missing id on decision', function(done) {
    createViewer(noDecisionXML, function(err, warnings, viewer) {
      expect(viewer.definitions.decision[0].id).to.eql(undefined);
      done();
    });
  });

  it('should repair empty id on decision', function(done) {
    createViewer(emptyDecisionXML, function(err, warnings, viewer) {
      expect(viewer.definitions.decision[0].id).to.not.eql(undefined);
      expect(viewer.definitions.decision[0].id).to.not.eql('');
      done();
    });
  });


  it('should re-import simple process', function(done) {
    // given
    createViewer(simpleXML, function(err, warnings, viewer) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      viewer.importXML(simpleXML, function(err, warnings) {

        // then
        expect(err).to.eql(null);
        expect(warnings.length).to.eql(0);

        done();
      });

    });
  });

  describe('defaults', function() {

    it('should use <body> as default parent', function(done) {

      var viewer = new Viewer();

      viewer.importXML(simpleXML, function(err, warnings) {

        expect(viewer.container.parentNode).to.eql(document.body);

        done(err, warnings);
      });
    });

  });


  describe('import events', function() {

    it('should fire <import.*> events', function(done) {

      // given
      var viewer = new Viewer({ container: container });

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
      viewer.importXML(emptyDefsXML, function(err) {

        // then
        expect(events).to.eql([
          'import.start',
          'import.success'
        ]);

        done(err);
      });
    });

  });

});
