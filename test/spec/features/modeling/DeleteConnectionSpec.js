'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */


var modelingModule = require('../../../../lib/features/modeling'),
    coreModule = require('../../../../lib/core');


describe('features/modeling - #removeConnection', function() {

  var diagramXML = require('../../../fixtures/dmn/simple-connections.dmn');

  var testModules = [ coreModule, modelingModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('shape handling', function() {

    it('should execute', inject(function(elementRegistry, modeling) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          authorityRequirementShape = knowledgeSource.incoming[0],
          authorityRequirement = authorityRequirementShape.businessObject;

      // when
      modeling.removeConnection(authorityRequirementShape);

      // then
      expect(authorityRequirement.$parent).to.be.null;

      expect(knowledgeSource.businessObject.extensionElements.values).to.have.length(1);
    }));
  });


  describe('undo support', function() {

    it('should undo', inject(function(elementRegistry, modeling, commandStack) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          authorityRequirementShape = knowledgeSource.incoming[0],
          authorityRequirement = authorityRequirementShape.businessObject;

      // when
      modeling.removeConnection(authorityRequirementShape);

      commandStack.undo();

      // then
      expect(authorityRequirement.$parent).to.exist;

      expect(knowledgeSource.businessObject.extensionElements.values).to.have.length(2);
    }));
  });


  describe('redo support', function() {

    it('redo', inject(function(elementRegistry, modeling, commandStack) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          authorityRequirementShape = knowledgeSource.incoming[0],
          authorityRequirement = authorityRequirementShape.businessObject;

      // when
      modeling.removeConnection(authorityRequirementShape);

      commandStack.undo();
      commandStack.redo();

      // then
      expect(authorityRequirement.$parent).to.be.null;

      expect(knowledgeSource.businessObject.extensionElements.values).to.have.length(1);
    }));
  });

});
