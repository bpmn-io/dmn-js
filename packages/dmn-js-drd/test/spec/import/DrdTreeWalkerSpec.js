/* global sinon */

import DrdTreeWalker from 'src/import/DrdTreeWalker';

import DmnModdle from 'dmn-moddle';

import simpleXML from 'test/fixtures/dmn/simple-1-3.dmn';


describe('import - DmnTreeWalker', function() {

  it('should expose API', function() {

    // when
    const walker = createWalker();

    // then
    expect(walker.handleDefinitions).to.exist;
  });


  it('should walk dmn:Definitions', async function() {

    // given
    const elementSpy = sinon.spy(),
          rootSpy = sinon.spy(),
          errorSpy = sinon.spy();

    const walker = createWalker({
      element: elementSpy,
      root: rootSpy,
      error: errorSpy
    });

    const parseResult = await createModdle(simpleXML);

    const {
      rootElement: definitions
    } = parseResult;

    walker.handleDefinitions(definitions);

    // then
    expect(elementSpy.callCount).to.equal(3);
    expect(rootSpy.calledOnce).to.be.true;
    expect(errorSpy.notCalled).to.be.true;
  });


  it('should assign current diagram to definitions', async function() {

    // given
    const walker = createWalker();

    const parseResult = await createModdle(simpleXML);

    const {
      rootElement: definitions
    } = parseResult;

    // when
    walker.handleDefinitions(definitions);

    // then
    expect(definitions.di).to.exist;
    expect(definitions.di.$type).to.eql('dmndi:DMNDiagram');
  });


  it('should error', async function() {

    // given
    const elementSpy = sinon.spy(),
          rootSpy = sinon.spy(),
          errorSpy = sinon.spy();

    const walker = createWalker({
      element: elementSpy,
      root: rootSpy,
      error: errorSpy
    });

    const parseResult = await createModdle(simpleXML);

    const {
      rootElement: definitions
    } = parseResult;

    const element = findElementWithId(definitions, 'InputData');

    // will error
    element.di = 'DI';

    // when
    walker.handleDefinitions(definitions);

    // then
    expect(elementSpy.callCount).to.equal(3);
    expect(rootSpy.calledOnce).to.be.true;
    expect(errorSpy.calledOnce).to.be.true;
  });

});


// helpers //////////

function createModdle(xml) {
  const moddle = new DmnModdle();

  return moddle.fromXML(xml, 'dmn:Definitions');
}

function createWalker(listeners) {

  listeners = listeners || {};

  const visitor = {
    element: function(element, parent) {
      listeners.element && listeners.element(element, parent);
    },
    root: function(root) {
      listeners.root && listeners.root(root);
    },
    error: function(message, context) {
      listeners.error && listeners.error(message, context);
    }
  };

  return new DrdTreeWalker(visitor, function() {});
}

function findElementWithId(definitions, id) {
  return (definitions.id === id && definitions) ||
    definitions.drgElement.find(function(element) {
      return element.id === id;
    });
}
