'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */


var modelingModule = require('../../../../lib/features/modeling'),
    coreModule = require('../../../../lib/core');


describe('features/modeling - move elements', function() {

  var testModules = [ coreModule, modelingModule ];

  describe('shapes', function() {

    var exampleXML = require('../../../fixtures/dmn/di.dmn');

    beforeEach(bootstrapModeler(exampleXML, { modules: testModules }));

    it('should move', inject(function(elementRegistry, modeling, canvas) {

      // given
      var rootElement = canvas.getRootElement().businessObject,
          elements = elementRegistry.filter(function(element) {
            return element.parent;
          }),
          decision = elementRegistry.get('dish-decision').businessObject,
          inforReqLen = decision.informationRequirement.length,
          authReqLen = decision.authorityRequirement.length,
          drgElementsLen = rootElement.drgElements.length,
          artifactsLen = rootElement.artifacts.length;

      // when
      modeling.moveElements(elements, { x: 0, y: 50 });

      // then
      expect(rootElement.drgElements).to.have.length(drgElementsLen);
      expect(rootElement.artifacts).to.have.length(artifactsLen);

      expect(decision.informationRequirement).to.have.length(inforReqLen);
      expect(decision.authorityRequirement).to.have.length(authReqLen);
    }));


    it('should undo', inject(function(elementRegistry, commandStack, modeling, canvas) {

      // given
      var rootElement = canvas.getRootElement().businessObject,
          elements = elementRegistry.filter(function(element) {
            return element.parent;
          }),
          decision = elementRegistry.get('dish-decision').businessObject,
          inforReqLen = decision.informationRequirement.length,
          authReqLen = decision.authorityRequirement.length,
          drgElementsLen = rootElement.drgElements.length,
          artifactsLen = rootElement.artifacts.length;

      // when
      modeling.moveElements(elements, { x: 0, y: 50 });

      commandStack.undo();

      // then
      expect(rootElement.drgElements).to.have.length(drgElementsLen);
      expect(rootElement.artifacts).to.have.length(artifactsLen);

      expect(decision.informationRequirement).to.have.length(inforReqLen);
      expect(decision.authorityRequirement).to.have.length(authReqLen);
    }));


    it('should redo', inject(function(elementRegistry, commandStack, modeling, canvas) {

      // given
      var rootElement = canvas.getRootElement().businessObject,
          elements = elementRegistry.filter(function(element) {
            return element.parent;
          }),
          decision = elementRegistry.get('dish-decision').businessObject,
          inforReqLen = decision.informationRequirement.length,
          authReqLen = decision.authorityRequirement.length,
          drgElementsLen = rootElement.drgElements.length,
          artifactsLen = rootElement.artifacts.length;

      // when
      modeling.moveElements(elements, { x: 0, y: 50 });

      commandStack.undo();
      commandStack.redo();

      // then
      expect(rootElement.drgElements).to.have.length(drgElementsLen);
      expect(rootElement.artifacts).to.have.length(artifactsLen);

      expect(decision.informationRequirement).to.have.length(inforReqLen);
      expect(decision.authorityRequirement).to.have.length(authReqLen);
    }));

  });

});
