import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';


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

      expect(knowledgeSource.incoming).to.have.length(0);
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

      expect(knowledgeSource.incoming).to.have.length(1);
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

      expect(knowledgeSource.incoming).to.have.length(0);
    }));
  });

});
