import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import { DmnVariableResolverModule } from '@bpmn-io/dmn-variable-resolver';

import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import CoreModule from 'src/core';
import TextareaEditorModule
  from 'src/features/textarea/editor';

import ModelingModule from 'src/features/modeling';


describe('textarea editor', function() {

  beforeEach(bootstrapModeler(literalExpressionXML, {
    modules: [
      CoreModule,
      TextareaEditorModule,
      ModelingModule,
      ExpressionLanguagesModule,
      DmnVariableResolverModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {

    // then
    expect(domQuery('.textarea', testContainer)).to.exist;
  });


  it('should edit literal expression text (FEEL)', inject(async function(viewer) {

    // given
    const editor = queryEditor('.textarea', testContainer);

    await act(() => editor.focus());

    // when
    await changeInput(document.activeElement, 'foo');

    // then
    expect(viewer.getDecision().decisionLogic.text).to.equal('foo');
  }));


  it('should edit literal expression text (non-FEEL)', inject(function(viewer) {

    // given
    viewer.get('modeling').editExpressionLanguage('javascript');
    const editor = queryEditor('.textarea', testContainer);

    editor.focus();

    // when
    triggerInputEvent(editor, 'foo');

    // then
    expect(viewer.getDecision().decisionLogic.text).to.equal('foo');
  }));


  describe('integration', function() {

    it('should pass variables to editor', inject(async function(viewer) {

      // given
      const editor = queryEditor('.textarea', testContainer);

      await act(() => editor.focus());

      // when
      await changeInput(document.activeElement, 'Var');

      // then
      await expectEventually(() => {
        const options = testContainer.querySelectorAll('[role="option"]');

        expect(options).to.exist;
        expect(options).to.satisfy(options => {
          const result = Array.from(options).some(
            option => option.textContent === 'Variable');
          return result;
        });
      });
    }));
  });

});

// helpers //////////

/**
 * @param {HTMLElement} input
 * @param {string} value
 */
function changeInput(input, value) {
  return act(() => input.textContent = value);
}

async function act(fn) {
  await fn();
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

async function expectEventually(fn) {
  for (let i = 0; i < 10; i++) {
    try {
      await act(() => {});
      await fn();
      return;
    } catch (e) {

      // wait
    }
  }

  return fn();
}
