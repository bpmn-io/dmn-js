'use strict';

/* global sinon */

var Viewer = require('../../lib/Viewer');

var exampleXML = require('../fixtures/dmn/di.dmn'),
    oneDecisionXML = require('../fixtures/dmn/one-decision.dmn'),
    namespaceXML = require('../fixtures/dmn/namespace.dmn'),
    emptyDefsXML = require('../fixtures/dmn/empty-definitions.dmn');

var TestContainer = require('mocha-test-container-support');


describe('Viewer', function() {

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
    createViewer(exampleXML, done);
  });


  it('should import empty definitions', function(done) {
    createViewer(emptyDefsXML, done);
  });


  it('should re-import simple process', function(done) {
    // given
    createViewer(exampleXML, function(err, warnings, viewer) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      viewer.importXML(exampleXML, function(err, warnings) {

        // then
        expect(err).to.not.exist;
        expect(warnings).to.have.length(0);

        done();
      });

    });

  });


  it('should fix the namespace from "dmn11.xsd" to "dmn.xsd"', function(done) {

    createViewer(namespaceXML, function(err, warnings, modeler) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      modeler.saveXML(function(err, xml) {
        if (err) {
          return done(err);
        }

        // then
        expect(err).to.not.exist;
        expect(xml.indexOf('xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd')).to.exist;

        done();
      });

    });

  });


  describe('interaction', function() {

    function triggerMouseEvent(type, gfx) {

      var event = document.createEvent('MouseEvent');
      event.initMouseEvent(type, true, true, window);

      return gfx.dispatchEvent(event);
    }


    it('should have a button to go to drd on table view', function(done) {
      createViewer(exampleXML, function(err, warnings, viewer) {
        var eventFired = false,
            eventPayload;

        viewer.showDecision(viewer.getDecisions()[0]);

        var button = viewer.table.container.querySelector('.tjs-controls button:last-child');

        expect(button.textContent).to.eql('Show DRD');

        viewer.on('view.switch', function(evt) {
          eventFired = true;
          eventPayload = evt;
        });

        triggerMouseEvent('click', button);

        expect(container.querySelector('.dmn-table')).to.not.exist;
        expect(container.querySelector('.dmn-diagram')).to.exist;

        expect(eventFired).to.be.true;
        expect(eventPayload.decision).to.exist;

        done();
      });
    });


    it('not go to table view if interaction is disabled', function(done) {
      var viewer = new Viewer({ container: container, disableDrdInteraction: true });

      viewer.importXML(exampleXML, function(err, warnings) {
        var elementRegistry = viewer.get('elementRegistry');
        var el = elementRegistry.getGraphics('dish-decision');

        triggerMouseEvent('dblclick', el);

        expect(container.querySelector('.dmn-diagram')).to.exist;
        expect(container.querySelector('.dmn-table')).to.not.exist;

        done();
      });
    });


    it('should not have a goto drd button if interaction is disabled', function(done) {
      var viewer = new Viewer({ container: container, disableDrdInteraction: true });

      viewer.importXML(exampleXML, function(err, warnings) {
        viewer.showDecision(viewer.getDecisions()[0]);

        var button = viewer.table.container.querySelector('.tjs-controls button:last-child');

        expect(button.textContent).to.not.eql('Show DRD');

        done();
      });
    });

  });


  describe('defaults', function() {

    it('should share the same moddle', function() {

      var viewer = new Viewer({ container: container });

      expect(viewer.moddle).to.equal(viewer.table.moddle);
    });


    it('should share definitions', function(done) {

      var viewer = new Viewer({ container: container });

      viewer.importXML(exampleXML, function(err, warnings) {

        expect(viewer.definitions).to.eql(viewer.table.definitions);

        done(err, warnings);
      });
    });


    it('should use <body> as default parent', function(done) {

      var viewer = new Viewer();

      viewer.importXML(exampleXML, function(err, warnings) {

        expect(viewer.container.parentNode).to.eql(document.body);

        done(err, warnings);
      });
    });


    it('should display the table if only one decision is present', function(done) {
      var viewer = new Viewer({ container: container }),
          tableViewer = viewer.table;

      var importSpy = sinon.spy(tableViewer, 'importDefinitions');

      viewer.importXML(oneDecisionXML, function(err, warnings) {

        expect(importSpy).to.have.been.called;
        expect(tableViewer.container.parentElement).to.eql(container);

        done(err, warnings);
      });

    });


    it('should NOT display the table if only one decision is present', function(done) {
      var viewer = new Viewer({ container: container, loadDiagram: true }),
          tableViewer = viewer.table;

      var importSpy = sinon.spy(tableViewer, 'importDefinitions');

      viewer.importXML(oneDecisionXML, function(err, warnings) {

        expect(importSpy).to.not.have.been.called;

        done(err, warnings);
      });

    });


    it('should return table as the active editor', function(done) {
      var viewer = new Viewer({ container: container }),
          tableViewer = viewer.table;

      viewer.importXML(oneDecisionXML, function(err, warnings) {

        var activeEditor = viewer.getActiveEditor();

        expect(activeEditor).to.equal(tableViewer);

        done(err, warnings);
      });

    });


    it('should return table as the active editor', function(done) {
      var viewer = new Viewer({ container: container });

      viewer.importXML(exampleXML, function(err, warnings) {

        var activeEditor = viewer.getActiveEditor();

        expect(activeEditor).to.equal(viewer);

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
      viewer.importXML(exampleXML, function(err) {

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

});
