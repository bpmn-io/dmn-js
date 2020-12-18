import exampleXML from '../fixtures/dmn/di.dmn';
import noDiXML from '../fixtures/dmn/no-di.dmn';
import emptyDefsXML from '../fixtures/dmn/empty-definitions.dmn';

import TestContainer from 'mocha-test-container-support';

import DrdModeler from '../helper/DrdModeler';


describe('Modeler', function() {

  var container, modeler;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  function createModeler(xml, done) {
    modeler = new DrdModeler({
      container: container,
      drd: {
        keyboard: {
          bindTo: document
        }
      }
    });

    modeler.importXML(xml, function(err, warnings) {
      done(err, warnings, modeler);
    });
  }


  it('should import simple DRD', function(done) {
    createModeler(exampleXML, done);
  });


  it('should import empty definitions', function(done) {
    createModeler(emptyDefsXML, done);
  });


  it('should re-import simple DRD', function(done) {

    // given
    createModeler(exampleXML, function(err, warnings, modeler) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      modeler.importXML(exampleXML, function(err, warnings) {

        // then
        expect(err).to.not.exist;
        expect(warnings).to.have.length(0);

        done();
      });

    });

  });


  describe('import events', function() {

    it('should emit <import.*> events', function(done) {

      // given
      var modeler = new DrdModeler({ container: container });

      var events = [];

      modeler.on([
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
      modeler.importXML(exampleXML, function(err) {

        // then
        expect(events).to.eql([
          [ 'import.parse.start', [ 'xml' ] ],
          [ 'import.parse.complete', ['error', 'definitions', 'context' ] ],
          [ 'import.render.start', [ 'view', 'element' ] ],
          [ 'import.render.complete', [ 'view', 'error', 'warnings' ] ],
          [ 'import.done', [ 'error', 'warnings' ] ]
        ]);

        done(err);
      });
    });

  });


  describe('decisions without DI', function() {

    it('should generate ID', function(done) {

      // given
      createModeler(noDiXML, function(err, warnings, modeler) {

        if (err) {
          return done(err);
        }

        var drdJS = modeler.getActiveViewer();

        var elementRegistry = drdJS.get('elementRegistry');

        // when
        var decision1 = elementRegistry.get('Decision_1');
        var decision3 = elementRegistry.get('Decision_3');
        var inputData = elementRegistry.get('InputData_1');

        // then
        expect(decision1).to.exist;
        expect(decision3).to.exist;

        // we generate DI for decisions, only
        expect(inputData).not.to.exist;

        expect(bounds(decision1)).to.eql({
          x: 180,
          y: 180,
          width: 180,
          height: 80
        });

        // we stack decision elements on top of each other
        expect(bounds(decision3)).to.eql({
          x: 240,
          y: 240,
          width: 180,
          height: 80
        });

        done();
      });

    });

  });


  describe('editor actions support', function() {

    it('should ship all actions', function(done) {

      createModeler(exampleXML, function(err, warnings, modeler) {

        // given
        var drdJS = modeler.getActiveViewer();

        var expectedActions = [
          'undo',
          'redo',
          'stepZoom',
          'zoom',
          'removeSelection',
          'moveCanvas',
          'moveSelection',
          'selectElements',
          'distributeElements',
          'alignElements',
          'lassoTool',
          'handTool',
          'directEditing'
        ];

        // when
        var editorActions = drdJS.get('editorActions');

        // then
        var actualActions = editorActions.getActions();

        expect(actualActions).to.eql(expectedActions);

        done();
      });

    });

  });

});


// helpers //////////////////////

function bounds(el) {
  return {
    x: el.x,
    y: el.y,
    width: el.width,
    height: el.height
  };
}
