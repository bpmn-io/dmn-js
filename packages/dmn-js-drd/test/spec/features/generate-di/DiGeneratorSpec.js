import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import diGeneratorModule from 'src/features/generate-di';

import noDiXML from 'test/fixtures/dmn/no-di.dmn';
import emptyDefinitionsXML from 'test/fixtures/dmn/empty-definitions.dmn';


describe('features - generate-di', function() {

  beforeEach(bootstrapModeler(noDiXML, {
    modules: [
      coreModule,
      modelingModule,
      diGeneratorModule
    ]
  }));


  it('should render decisions', inject(function(elementRegistry) {

    // when
    var elements = elementRegistry.getAll();

    // then
    expect(elements).to.have.length(5);
  }));


  it('should generate deciisions DMNDI', inject(function(canvas) {

    // when
    var rootElement = canvas.getRootElement();

    var definitions = rootElement.businessObject;

    // then
    expect(definitions.dmnDI).to.exist;
    expect(definitions.dmnDI.diagrams).to.have.length(1);
    expect(definitions.dmnDI.diagrams[0].diagramElements).to.have.length(4);
  }));


  it('should not render non-decision elements', inject(function(elementRegistry) {

    // when
    var inputData = elementRegistry.get('InputData_1');

    // then
    expect(inputData).to.not.exist;
  }));


  describe('empty definitions', function() {

    beforeEach(bootstrapModeler(emptyDefinitionsXML, {
      modules: [
        coreModule,
        modelingModule,
        diGeneratorModule
      ]
    }));


    it('should open empty definitions', inject(function(canvas) {

      // then
      expect(canvas.getRootElement()).to.have.property('id', 'definitions');
    }));
  });
});
