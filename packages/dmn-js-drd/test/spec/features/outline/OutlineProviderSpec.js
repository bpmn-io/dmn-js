import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import outlineProviderModule from 'src/features/outline';

import diagramXml from './OutlineProvider.dmn';

import {
  KNOWLEDGE_SOURCE_OUTLINE_PATH,
  BUSINESS_KNOWLEDGE_MODEL_OUTLINE_PATH
} from 'src/features/outline/OutlineUtil';


describe('features/outline - outline provider', function() {
  var testModules = [
    coreModule,
    modelingModule,
    outlineProviderModule
  ];


  beforeEach(bootstrapModeler(diagramXml, { modules: testModules }));

  describe('should provide outline for', function() {

    it('input data', inject(function(elementRegistry, outline) {

      // given
      var inputData = elementRegistry.get('InputData');

      // when
      var outlineShape = outline.getOutline(inputData);

      // then
      expect(outlineShape).to.exist;
      expect(outlineShape.tagName).to.eql('rect');
    }));


    it('knowledge source', inject(function(elementRegistry, outline) {

      // given
      var knowledgeSource = elementRegistry.get('KnowledgeSource');

      // when
      var outlineShape = outline.getOutline(knowledgeSource);

      // then
      expect(outlineShape).to.exist;
      expect(outlineShape.tagName).to.eql('path');
      expect(outlineShape.getAttribute('d')).to.eql(KNOWLEDGE_SOURCE_OUTLINE_PATH);
    }));


    it('business knowledge model', inject(function(elementRegistry, outline) {

      // given
      var businessKnowledgeModel = elementRegistry.get('BusinessKnowledgeModel');

      // when
      var outlineShape = outline.getOutline(businessKnowledgeModel);

      // then
      expect(outlineShape).to.exist;
      expect(outlineShape.tagName).to.eql('path');
      expect(outlineShape.getAttribute('d'))
        .to.eql(BUSINESS_KNOWLEDGE_MODEL_OUTLINE_PATH);
    }));

  });

});