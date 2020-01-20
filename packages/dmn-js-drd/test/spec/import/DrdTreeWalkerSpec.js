/* global sinon */

import DrdTreeWalker from 'lib/import/DrdTreeWalker';

import DmnModdle from 'dmn-moddle';

import simpleXML from 'test/fixtures/dmn/simple-1-3.dmn';


describe('import - DmnTreeWalker', function() {

  it('should expose API', function() {

    // when
    var walker = createWalker();

    // then
    expect(walker.handleDefinitions).to.exist;
  });


  it('should walk dmn:Definitions', function(done) {

    // given
    var elementSpy = sinon.spy(),
        rootSpy = sinon.spy(),
        errorSpy = sinon.spy();

    var walker = createWalker({
      element: elementSpy,
      root: rootSpy,
      error: errorSpy
    });

    createModdle(simpleXML, function(err, definitions, context, moddle) {

      // when
      walker.handleDefinitions(definitions);

      // then
      expect(elementSpy.callCount).to.equal(3);
      expect(rootSpy.calledOnce).to.be.true;
      expect(errorSpy.notCalled).to.be.true;

      done();
    });
  });


  it('should assign current diagram to definitions', function(done) {

    // given
    var walker = createWalker();

    createModdle(simpleXML, function(err, definitions, context, moddle) {

      // when
      walker.handleDefinitions(definitions);

      // then
      expect(definitions.di).to.exist;
      expect(definitions.di.$type).to.eql('dmndi:DMNDiagram');

      done();
    });

  });


  it('should error', function(done) {

    // given
    var elementSpy = sinon.spy(),
        rootSpy = sinon.spy(),
        errorSpy = sinon.spy();

    var walker = createWalker({
      element: elementSpy,
      root: rootSpy,
      error: errorSpy
    });

    createModdle(simpleXML, function(err, definitions, context, moddle) {

      var element = findElementWithId(definitions, 'InputData');

      // will error
      element.di = 'DI';

      // when
      walker.handleDefinitions(definitions);

      // then
      expect(elementSpy.callCount).to.equal(3);
      expect(rootSpy.calledOnce).to.be.true;
      expect(errorSpy.calledOnce).to.be.true;

      done();
    });
  });

});


// helpers //////////

function createModdle(xml, done) {
  var moddle = new DmnModdle();

  moddle.fromXML(xml, 'dmn:Definitions', function(err, definitions, context) {
    done(err, definitions, context, moddle);
  });
}

function createWalker(listeners) {

  listeners = listeners || {};

  var visitor = {
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