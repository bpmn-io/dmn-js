'use strict';

var Viewer = require('../../../lib/table/Viewer');

var simpleXML = require('../../fixtures/dmn/simple.dmn'),
    emptyDefsXML = require('../../fixtures/dmn/empty-definitions.dmn'),
    emptyDecisionXML = require('../../fixtures/dmn/empty-decision-id.dmn'),
    noDecisionXML = require('../../fixtures/dmn/no-decision-id.dmn'),
    multipleTablesXML = require('../../fixtures/dmn/multiple-tables.dmn');

var TestContainer = require('mocha-test-container-support');


describe('Table - Viewer', function() {

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
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
      expect(viewer.definitions.drgElements[0].id).to.eql(undefined);
      done();
    });
  });


  it('should repair empty id on decision', function(done) {
    createViewer(emptyDecisionXML, function(err, warnings, viewer) {
      expect(err).to.not.exist;
      expect(warnings).to.have.length(0);

      expect(viewer.definitions.drgElements[0].id).to.not.eql(undefined);
      expect(viewer.definitions.drgElements[0].id).to.not.eql('');
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
        expect(err).to.not.exist;
        expect(warnings).to.have.length(0);

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

    it('should emit <import.*> events', function(done) {

      // given
      var viewer = new Viewer({ container: container });

      var events = [];

      viewer.on([
        'import.parse.start',
        'import.parse.complete',
        'import.render.start',
        'import.render.complete',
        'import.done'
      ], function(e) {
        // log event type + event arguments
        events.push([
          e.type,
          Object.keys(e).filter(function(key) {
            return key !== 'type';
          })
        ]);
      });

      // when
      viewer.importXML(emptyDefsXML, function(err) {

        // then
        expect(events).to.eql([
          [ 'import.parse.start', [ 'xml' ] ],
          [ 'import.parse.complete', ['error', 'definitions', 'context' ] ],
          [ 'import.render.start', [ 'definitions' ] ],
          [ 'import.render.complete', [ 'error', 'warnings' ] ],
          [ 'import.done', [ 'error', 'warnings' ] ]
        ]);

        done(err);
      });
    });

  });


  describe('xml with multiple tables', function() {
    it('should display the first table by default', function(done) {
      // given
      var viewer = new Viewer();

      // when
      viewer.importXML(multipleTablesXML, function(err, warnings) {

        // then
        expect(viewer.container.querySelector('header > h3').textContent).to.eql('Dish Decision');
        done();
      });
    });

    it('should expose all contained decision tables', function(done) {
      // given
      var viewer = new Viewer();

      // when
      viewer.importXML(multipleTablesXML, function(err, warnings) {

        // then
        expect(viewer.getDecisions().length).to.eql(3);
        done();
      });
    });

    it('should switch between decision tables', function(done) {
      // given
      var viewer = new Viewer();

      viewer.importXML(multipleTablesXML, function(err, warnings) {

        // when
        viewer.showDecision(viewer.getDecisions()[2]);

        // then
        expect(viewer.container.querySelector('header > h3').textContent).to.eql('Guest Count');
        done();
      });
    });
  });

});
