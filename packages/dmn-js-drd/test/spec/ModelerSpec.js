import doubleDiXML from '../fixtures/dmn/double-di.dmn';
import exampleXML from '../fixtures/dmn/di.dmn';
import noDiXML from '../fixtures/dmn/no-di.dmn';
import emptyDefsXML from '../fixtures/dmn/empty-definitions.dmn';

import TestContainer from 'mocha-test-container-support';

import DrdModeler from '../helper/DrdModeler';


describe('Modeler', function() {

  let container, modeler;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  function createModeler(xml) {
    modeler = new DrdModeler({
      container: container
    });

    return modeler.importXML(xml);
  }


  it('should import simple DRD', function() {
    return createModeler(exampleXML);
  });


  it('should import empty definitions', function() {
    return createModeler(emptyDefsXML);
  });


  it('should re-import simple DRD', async function() {

    // given
    await createModeler(exampleXML);

    // when
    // mimic re-import of same diagram
    const { warnings } = await modeler.importXML(exampleXML);

    // then
    expect(warnings).to.have.length(0);
  });


  describe('import events', function() {

    it('should emit <import.*> events', async function() {

      // given
      const modeler = new DrdModeler({ container: container });

      const events = [];

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
      await modeler.importXML(exampleXML);

      // then
      expect(events).to.eql([
        [ 'import.parse.start', [ 'xml' ] ],
        [ 'import.parse.complete', [ 'error', 'definitions', 'elementsById',
          'references', 'warnings', 'context' ] ],
        [ 'import.render.start', [ 'view', 'element' ] ],
        [ 'import.render.complete', [ 'view', 'error', 'warnings' ] ],
        [ 'import.done', [ 'error', 'warnings' ] ]
      ]);

    });

  });


  describe('decisions without DI', function() {

    it('should generate ID', async function() {

      // given
      await createModeler(noDiXML);

      const drdJS = modeler.getActiveViewer();

      const elementRegistry = drdJS.get('elementRegistry');

      // when
      const decision1 = elementRegistry.get('Decision_1');
      const decision3 = elementRegistry.get('Decision_3');
      const inputData = elementRegistry.get('InputData_1');

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

    });

  });


  describe('editor actions support', function() {

    it('should ship all actions', async function() {

      await createModeler(exampleXML);

      // given
      const drdJS = modeler.getActiveViewer();

      const expectedActions = [
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
        'directEditing',
        'find'
      ];

      // when
      const editorActions = drdJS.get('editorActions');

      // then
      const actualActions = editorActions.getActions();

      expect(actualActions).to.eql(expectedActions);

    });

  });


  describe('#open', function() {

    it('should be able to provide warnings', async function() {

      // given
      container = TestContainer.get(this);

      const drdModeler = new DrdModeler({
        container: container
      });

      // when
      const { warnings } = await drdModeler.importXML(doubleDiXML);

      // then
      expect(warnings).to.exist;
      expect(warnings).to.have.length(1);

      expect(warnings[0].message).to.equal('multiple DI elements defined for element');

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
