import { bootstrapModeler, inject, act } from 'test/helper';

import { query as domQuery } from 'min-dom';

import { DmnVariableResolverModule } from '@bpmn-io/dmn-variable-resolver';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';

import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import TestContainer from 'mocha-test-container-support';

import emptyRuleXML from './empty-rule.dmn';
import languageExpressionXML from '../../expression-language.dmn';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';
import DecisionRulesModule from 'src/features/decision-rules';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';

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


describe('features/decision-rules', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('editing', function() {

    beforeEach(bootstrapModeler(languageExpressionXML, {
      modules: [
        CoreModule,
        ModelingModule,
        DecisionRulesModule,
        DecisionRulesEditorModule
      ],
      debounceInput: false,
      expressionLanguages: {
        options: CUSTOM_EXPRESSION_LANGUAGES
      },
    }));


    it('should edit cell (FEEL)', inject(async function(elementRegistry) {

      // given
      const editor = queryEditor('[data-element-id="outputEntry2"]', testContainer);

      await act(() => editor.focus());

      // when
      await changeInput(document.activeElement, 'foo');

      // then
      expect(elementRegistry.get('outputEntry2').businessObject.text).to.equal('foo');
    }));


    it('should edit cell - line breaks (FEEL)', inject(async function(elementRegistry) {

      // given
      let editor = queryEditor('[data-element-id="outputEntry2"]', testContainer);

      await act(() => editor.focus());
      editor = document.activeElement;

      // when
      await changeInput(editor, 'foo\nbar');

      editor.blur();

      // then
      expect(elementRegistry.get('outputEntry2').businessObject.text)
        .to.equal('foo\nbar');
    }));


    it('should edit cell (non-FEEL)', inject(function(elementRegistry) {

      // given
      const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

      editor.focus();

      // when
      triggerInputEvent(editor, 'foo');

      // then
      expect(elementRegistry.get('inputEntry1').businessObject.text).to.equal('foo');
    }));


    it('should edit cell - line breaks (non-FEEL)', inject(function(elementRegistry) {

      // given
      const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

      editor.focus();

      // when
      triggerInputEvent(editor, 'foo<br>bar<br>');

      editor.blur();

      // then
      expect(elementRegistry.get('inputEntry1').businessObject.text).to.equal('foo\nbar');

      expect(editor.innerHTML).to.equal('foo<br>bar<br>');
    }));

  });


  describe('expression language', function() {

    describe('no default expression language', function() {

      beforeEach(bootstrapModeler(languageExpressionXML, {
        expressionLanguages: {
          options: CUSTOM_EXPRESSION_LANGUAGES
        },
        modules: [
          CoreModule,
          ModelingModule,
          DecisionRulesModule,
          DecisionRulesEditorModule
        ]
      }));


      describe('on input', function() {

        it('should not display default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry2"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });


        it('should display non-default default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.exist;
        });


        skipFF()('should not display if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

          // when
          editor.focus();

          // then
          const badge = domQuery('.dmn-expression-language', cell);
          expect(badge).to.satisfy(isNotDisplayed);
        });

      });


      describe('on output', function() {

        it('should not display default', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });


        it('should display non-default',function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.exist;
        });


        skipFF()('should not display if focussed', function() {


          // given
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          const editor = queryEditor('[data-element-id="outputEntry1"]', testContainer);

          // when
          editor.focus();

          // then
          const badge = domQuery('.dmn-expression-language', cell);
          expect(badge).to.satisfy(isNotDisplayed);
        });

      });

    });


    describe('configured default expression language', function() {

      beforeEach(bootstrapModeler(languageExpressionXML, {
        expressionLanguages: {
          options: CUSTOM_EXPRESSION_LANGUAGES
        },
        modules: [
          CoreModule,
          ModelingModule,
          DecisionRulesModule,
          DecisionRulesEditorModule
        ],
        defaultInputExpressionLanguage: 'javascript',
        defaultOutputExpressionLanguage: 'javascript'
      }));


      describe('on input', function() {

        it('should not display default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry2"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });


        it('should display non-default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.exist;
        });


        skipFF()('should not display if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

          // when
          editor.focus();

          // then
          const badge = domQuery('.dmn-expression-language', cell);
          expect(badge).to.satisfy(isNotDisplayed);
        });

      });


      describe('on output', function() {

        it('should not display default', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });


        it('should display non-default',function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.exist;
        });


        skipFF()('should not display expression language if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

          const editor = queryEditor('[data-element-id="outputEntry2"]', testContainer);

          // when
          editor.focus();

          // then
          const badge = domQuery('.dmn-expression-language', cell);
          expect(badge).to.satisfy(isNotDisplayed);
        });

      });

    });

  });


  describe('placeholder', function() {

    beforeEach(bootstrapModeler(emptyRuleXML, {
      modules: [
        CoreModule,
        ModelingModule,
        DecisionRulesModule,
        DecisionRulesEditorModule
      ],
      debounceInput: false
    }));


    it('should show <-> input placeholder', inject(function() {

      // when
      const editor = queryEditor('[data-element-id="unaryTest_1"]', testContainer);

      // then
      expect(editor.matches('[data-placeholder="-"]')).to.be.true;
    }));


    it('should NOT show <-> output placeholder', inject(function() {

      // when
      const editor = queryEditor('[data-element-id="outputEntry_1"]', testContainer);

      // then
      expect(editor.matches('[data-placeholder="-"]')).to.be.false;
    }));

  });


  describe('integration', function() {

    beforeEach(bootstrapModeler(emptyRuleXML, {
      modules: [
        CoreModule,
        ModelingModule,
        DecisionRulesModule,
        DecisionRulesEditorModule,
        DmnVariableResolverModule
      ],
      debounceInput: false
    }));


    it('should pass variables to editor', async function() {

      // given
      let editor = queryEditor('[data-element-id="unaryTest_1"]', testContainer);
      await changeFocus(editor);

      // when
      await changeInput(document.activeElement, 'Var');

      // then
      return expectEventually(() => {
        const options = testContainer.querySelectorAll('[role="option"]');

        expect(options).to.exist;
        expect(options).to.satisfy(options => {
          const result = Array.from(options).some(
            option => option.textContent === 'Variable');
          return result;
        });
      });
    });
  });
});

// helpers //////////////////
function isNotDisplayed(element) {
  return !element || getComputedStyle(element).display === 'none';
}

/**
 * @param {HTMLElement} input
 * @param {string} value
 */
async function changeInput(input, value) {
  await act(() => input.textContent = value);
}

async function changeFocus(editor) {
  await act(() => editor.focus());
}

async function expectEventually(fn) {
  for (let i = 0; i < 20; i++) {
    try {
      await fn();
      return;
    } catch {
      await act(() => {});
    }
  }

  await fn();
}

function isFirefox() {
  return /Firefox/.test(window.navigator.userAgent);
}

function skipFF() {
  return isFirefox() ? it.only : it;
}
