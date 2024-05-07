import { bootstrapModeler, inject, act } from 'test/helper';

import {
  triggerInputEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import { DmnVariableResolverModule } from '@bpmn-io/dmn-variable-resolver';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from './InputEditor.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';
import ModelingModule from 'src/features/modeling';
import KeyboardModule from 'src/features/keyboard';


describe('decision-table-head/editor - input', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule,
      ModelingModule,
      KeyboardModule,
      DmnVariableResolverModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  function openEditor(columnId) {
    const cellEl = domQuery(`[data-col-id="${columnId}"]`, testContainer);

    // open input editor
    triggerMouseEvent(cellEl, 'dblclick');

    // return input editor
    return domQuery('.input-edit', testContainer);
  }


  describe('input expression', function() {

    describe('FEEL', function() {

      it('should display FEEL editor if expression language is FEEL',
        function() {

          // when
          const editorEl = openEditor('input2');
          const control = getControl('.ref-text', editorEl);

          // then
          expect(control.matches('.literal-expression')).to.be.true;
        }
      );


      it('should add input expression text', inject(async function(elementRegistry) {

        // given
        const editorEl = openEditor('input2');

        const inputBo = elementRegistry.get('input2').businessObject;

        const control = getControl('.ref-text', editorEl);

        // assume
        expect(control.textContent).to.eql('');

        // when
        const input = control.querySelector('[role="textbox"]');
        await changeInput(input, 'foo');

        // then
        expect(inputBo.inputExpression.text).to.equal('foo');
      }));


      it('should edit input expression text', inject(async function(elementRegistry) {

        // given
        const editorEl = openEditor('input1');

        const inputBo = elementRegistry.get('input1').businessObject;

        const control = getControl('.ref-text', editorEl);

        // when
        const input = control.querySelector('[role="textbox"]');
        await changeInput(input, 'foo');

        // then
        expect(inputBo.inputExpression.text).to.equal('foo');
      }));
    });


    describe('non-FEEL', function() {


      beforeEach(bootstrapModeler(simpleXML, {
        modules: [
          CoreModule,
          DecisionTableHeadModule,
          DecisionTableHeadEditorModule,
          ModelingModule,
          KeyboardModule
        ],
        debounceInput: false,
        expressionLanguages: {
          options: [
            {
              value: 'javascript',
              label: 'JavaScript'
            }
          ]
        }
      }));


      it('should display content-editable if expression language is not FEEL',
        function() {

          // when
          const editorEl = openEditor('input2');
          const control = getControl('.ref-text', editorEl);

          // then
          expect(control.matches('.content-editable')).to.be.true;
        }
      );


      it('should add input expression text', inject(function(elementRegistry) {

        // given
        const editorEl = openEditor('input2');

        const inputBo = elementRegistry.get('input2').businessObject;

        const inputEl = getControl('.ref-text', editorEl);

        // assume
        expect(inputEl.textContent).to.eql('');

        inputEl.focus();

        // when
        triggerInputEvent(inputEl, 'foo');

        // then
        expect(inputBo.inputExpression.text).to.equal('foo');
      }));


      it('should edit input expression text', inject(function(elementRegistry) {

        // given
        const editorEl = openEditor('input1');

        const inputBo = elementRegistry.get('input1').businessObject;

        const inputEl = getControl('.ref-text', editorEl);

        inputEl.focus();

        // when
        triggerInputEvent(inputEl, 'foo');

        // then
        expect(inputBo.inputExpression.text).to.equal('foo');
      }));
    });


    describe('integration', function() {

      it('should pass variables to editor', async function() {

        // given
        const editorEl = openEditor('input2');
        const input = getControl('.ref-text [role="textbox"]', editorEl);

        // when
        await changeInput(input, 'Var');

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


  describe('should edit input label', function() {

    beforeEach(function() {
      openEditor('input1');
    });


    it('set', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.dms-input-label', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo bar');

      // then
      expect(inputBo.get('label')).to.equal('foo bar');
    }));


    it('unset', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.dms-input-label', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo bar');
      triggerInputEvent(inputEl, '');

      // then
      expect(inputBo.get('label')).not.to.exist;
    }));

  });

});


function getControl(selector, parent) {
  return domQuery('.ref-input-editor ' + selector, parent);
}

/**
 * @param {HTMLElement} input
 * @param {string} value
 */
async function changeInput(input, value) {
  await act(() => input.textContent = value);
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
