import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import {
  bootstrapModeler,
  bootstrapViewer,
  inject
} from 'test/helper';

import {
  triggerInputEvent,
  triggerInputSelectChange
} from 'dmn-js-shared/test/util/EventUtil';

import literalExpressionXML from '../../literal-expression.dmn';
import nonDefaultExpressionLanguageXML from '../../expression-language.dmn';
import definitionsExpressionLanguageXML from '../../definitions-expression-language.dmn';
import definitionsFeelExpressionLanguageXML from
  '../../definitions-feel-expression-language.dmn';
import bkmXML from '../../bkm-literal-expression.dmn';
import decisionTableXML from '../../simple.dmn';

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


describe('features/literal-expression - expression language', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function queryExpressionLanguage() {
    return domQuery('.dmn-boxed-expression-footer .element-expression-language', testContainer);
  }

  function queryExpressionLanguageSelect() {
    return domQuery('.dms-input-select', queryExpressionLanguage());
  }


  describe('editor', function() {

    describe('default expression language', function() {

      beforeEach(bootstrapModeler(literalExpressionXML, { debounceInput: false }));


      it('should NOT display', function() {

        // then
        expect(queryExpressionLanguage()).not.to.exist;
      });

    });


    describe('non-default expression language', function() {

      beforeEach(bootstrapModeler(nonDefaultExpressionLanguageXML, {
        debounceInput: false
      }));


      it('should display', function() {

        // then
        expect(queryExpressionLanguageSelect()).to.exist;
      });


      it('should have accessible label', function() {

        // when
        const label = domQuery('label', queryExpressionLanguage());

        // then
        expect(label.getAttribute('for')).to.equal(
          domQuery('input[id]', queryExpressionLanguageSelect()).id
        );
      });


      it('should edit expression language - input', inject(function(viewer) {

        // given
        const input = domQuery('.dms-input', queryExpressionLanguageSelect());

        // when
        triggerInputEvent(input, 'foo');

        // then
        expect(viewer.getRootElement().decisionLogic.expressionLanguage)
          .to.equal('foo');
      }));

    });


    describe('custom expression languages', function() {

      beforeEach(bootstrapModeler(literalExpressionXML, {
        expressionLanguages: {
          options: CUSTOM_EXPRESSION_LANGUAGES
        },
        debounceInput: false
      }));


      it('should display default expression language', function() {

        // when
        const input = domQuery('.dms-input', queryExpressionLanguageSelect());

        // then
        expect(input.value).to.equal('feel');
      });


      it('should edit expression language - select', inject(function(viewer) {

        // given
        const inputSelect = queryExpressionLanguageSelect();

        // when
        triggerInputSelectChange(inputSelect, 'javascript', testContainer);

        // then
        expect(viewer.getRootElement().decisionLogic.expressionLanguage)
          .to.equal('javascript');
      }));


      it('should remove expression language', inject(function(viewer) {

        // given
        const inputSelect = queryExpressionLanguageSelect();

        triggerInputSelectChange(inputSelect, 'javascript', testContainer);

        const input = domQuery('.dms-input', queryExpressionLanguageSelect());

        // when
        triggerInputEvent(input, '');

        // then
        expect(viewer.getRootElement().decisionLogic.expressionLanguage)
          .to.not.exist;
      }));


      it('should undo', inject(function(commandStack, viewer) {

        // given
        const inputSelect = queryExpressionLanguageSelect();

        triggerInputSelectChange(inputSelect, 'javascript', testContainer);

        // when
        commandStack.undo();

        // then
        expect(viewer.getRootElement().decisionLogic.expressionLanguage)
          .to.not.exist;
      }));

    });


    describe('inherited expression language', function() {

      describe('non-default', function() {

        beforeEach(bootstrapModeler(definitionsExpressionLanguageXML, {
          expressionLanguages: {
            options: CUSTOM_EXPRESSION_LANGUAGES
          },
          debounceInput: false
        }));


        it('should display', function() {

          // when
          const input = domQuery('.dms-input', queryExpressionLanguageSelect());

          // then
          expect(input.value).to.equal('juel');
        });


        it('should use matching editor', function() {

          // then
          expect(domQuery('.dmn-boxed-expression-body .textarea.editor [role="textbox"]',
            testContainer)).to.exist;
          expect(domQuery('.dmn-boxed-expression-body .cm-editor', testContainer))
            .not.to.exist;
        });

      });


      describe('FEEL namespace', function() {

        beforeEach(bootstrapModeler(definitionsFeelExpressionLanguageXML, {
          expressionLanguages: {
            options: CUSTOM_EXPRESSION_LANGUAGES
          },
          debounceInput: false
        }));


        it('should display as FEEL', function() {

          // when
          const input = domQuery('.dms-input', queryExpressionLanguageSelect());

          // then
          expect(input.value).to.equal('feel');
        });

      });

    });


    describe('case-insensitive match', function() {

      beforeEach(bootstrapModeler(nonDefaultExpressionLanguageXML, {
        expressionLanguages: {
          options: [ { label: 'FEEL', value: 'feel' }, { label: 'JS', value: 'JavaScript' } ]
        },
        debounceInput: false
      }));


      it('should display label of option', function() {

        // when
        const input = domQuery('.dms-input', queryExpressionLanguageSelect());

        // then
        expect(input.value).to.equal('JavaScript');
      });

    });


    describe('business knowledge model', function() {

      beforeEach(bootstrapModeler(bkmXML, {
        expressionLanguages: {
          options: CUSTOM_EXPRESSION_LANGUAGES
        }
      }));


      it('should NOT display', function() {

        // then
        expect(queryExpressionLanguage()).not.to.exist;
      });

    });


    describe('decision table', function() {

      beforeEach(bootstrapModeler(decisionTableXML, {
        expressionLanguages: {
          options: CUSTOM_EXPRESSION_LANGUAGES
        }
      }));


      it('should NOT display', function() {

        // then
        expect(queryExpressionLanguage()).not.to.exist;
      });

    });

  });


  describe('viewer', function() {

    describe('default expression language', function() {

      beforeEach(bootstrapViewer(literalExpressionXML));


      it('should NOT display', function() {

        // then
        expect(queryExpressionLanguage()).not.to.exist;
      });

    });


    describe('non-default expression language', function() {

      beforeEach(bootstrapViewer(nonDefaultExpressionLanguageXML));


      it('should display', function() {

        // when
        const expressionLanguage = queryExpressionLanguage();

        // then
        expect(expressionLanguage.textContent).to.contain('javascript');
      });


      it('should NOT be editable', function() {

        // then
        expect(queryExpressionLanguageSelect()).not.to.exist;
      });

    });


    describe('custom expression languages', function() {

      beforeEach(bootstrapViewer(literalExpressionXML, {
        expressionLanguages: {
          options: CUSTOM_EXPRESSION_LANGUAGES
        }
      }));


      it('should display label of default expression language', function() {

        // when
        const expressionLanguage = queryExpressionLanguage();

        // then
        expect(expressionLanguage.textContent).to.contain('FEEL');
      });

    });

  });

});
