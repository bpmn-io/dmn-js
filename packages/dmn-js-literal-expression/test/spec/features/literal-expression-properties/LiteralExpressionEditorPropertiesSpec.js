import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerInputEvent,
  triggerInputSelectChange
} from 'dmn-js-shared/test/util/EventUtil';

import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';
import DataTypesModule from 'dmn-js-shared/lib/features/data-types';

import {
  query as domQuery
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';
import nonDefaultExpressionLanguageXML from '../../expression-language.dmn';
import literalExpressionNoTypeRefXML
  from './LiteralExpressionEditorProperties.no-type-ref.dmn';

import LiteralExpressionPropertiesEditorModule
  from 'src/features/literal-expression-properties/editor';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';
import TranslateModule from 'diagram-js/lib/i18n/translate';


const CUSTOM_EXPRESSION_LANGUAGES = [ {
  label: 'FEEL',
  value: 'feel'
}, {
  label: 'JUEL',
  value: 'juel'
}, {
  label: 'JavaScript',
  value: 'javascript'
}, {
  label: 'Groovy',
  value: 'groovy'
}, {
  label: 'Python',
  value: 'python'
}, {
  label: 'JRuby',
  value: 'jruby'
} ];


describe('literal expression properties editor', function() {

  const testModules = [
    CoreModule,
    TranslateModule,
    LiteralExpressionPropertiesEditorModule,
    ModelingModule,
    ExpressionLanguagesModule,
    DataTypesModule
  ];

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('basics', function() {

    beforeEach(bootstrapModeler(literalExpressionXML, {
      modules: testModules,
      debounceInput: false
    }));

    it('should render', function() {

      // then
      expect(domQuery('.literal-expression-properties', testContainer)).to.exist;
    });


    it('should render accessible label for name', function() {

      // given
      const nameInput = domQuery('.variable-name-input', testContainer);

      // then
      expect(nameInput.getAttribute('aria-label')).to.exist;
    });


    it('should render accessible label for type', function() {

      // given
      const type = domQuery('.variable-type-select', testContainer);

      // then
      expect(domQuery('[aria-label]', type)).to.exist;
    });


    it('should edit variable name', inject(function(viewer) {

      // given
      const input = domQuery('.variable-name-input', testContainer);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(viewer.getDecision().variable.name).to.equal('foo');
    }));


    it('should edit variable type - input', inject(function(viewer) {

      // given
      const inputSelect = domQuery('.variable-type-select', testContainer);

      const input = domQuery('.dms-input', inputSelect);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(viewer.getDecision().variable.typeRef).to.equal('foo');
    }));


    it('should edit variable type - select', inject(function(viewer) {

      // given
      const inputSelect = domQuery('.variable-type-select', testContainer);

      // when
      triggerInputSelectChange(inputSelect, 'boolean', testContainer);

      // then
      expect(viewer.getDecision().variable.typeRef).to.equal('boolean');
    }));


    it('should remove variable type', inject(function(viewer) {

      // given
      const inputSelect = domQuery('.variable-type-select', testContainer);

      triggerInputSelectChange(inputSelect, 'boolean', testContainer);

      const input = domQuery('.dms-input', inputSelect);

      // when
      triggerInputEvent(input, '');

      // then
      expect(viewer.getDecision().variable.typeRef).to.not.exist;
    }));


    it('should NOT display expression language if decision\'s EL is default', function() {

      // given
      const inputSelect = domQuery('.expression-language-select', testContainer);

      // then
      expect(inputSelect).not.to.exist;
    });
  });


  describe('non-default expression language', function() {

    beforeEach(bootstrapModeler(nonDefaultExpressionLanguageXML, {
      modules: testModules,
      debounceInput: false
    }));


    it('should edit expression language - input', inject(function(viewer) {

      // given
      const inputSelect = domQuery('.expression-language-select', testContainer);

      const input = domQuery('.dms-input', inputSelect);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(viewer.getDecision().decisionLogic.expressionLanguage)
        .to.equal('foo');
    }));
  });


  describe('custom expression languages', function() {

    beforeEach(bootstrapModeler(literalExpressionXML, {
      expressionLanguages: {
        options: CUSTOM_EXPRESSION_LANGUAGES
      },
      modules: testModules,
      debounceInput: false
    }));


    it('should edit expression language - select', inject(function(viewer) {

      // given
      const inputSelect = domQuery('.expression-language-select', testContainer);

      // when
      triggerInputSelectChange(inputSelect, 'javascript', testContainer);

      // then
      expect(viewer.getDecision().decisionLogic.expressionLanguage)
        .to.equal('javascript');
    }));


    it('should remove expression language', inject(function(viewer) {

      // given
      const inputSelect = domQuery('.expression-language-select', testContainer);
      const input = domQuery('.dms-input', inputSelect);

      // when
      triggerInputEvent(input, '');

      // then
      expect(viewer.getDecision().decisionLogic.expressionLanguage)
        .to.not.exist;
    }));
  });


  describe('no typeRef', function() {

    beforeEach(bootstrapModeler(literalExpressionNoTypeRefXML, {
      modules: testModules,
      debounceInput: false
    }));


    it('should render', function() {

      // then
      expect(domQuery('.literal-expression-properties', testContainer)).to.exist;
    });

  });

});