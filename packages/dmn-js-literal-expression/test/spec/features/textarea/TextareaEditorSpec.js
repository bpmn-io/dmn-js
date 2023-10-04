import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

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
      ExpressionLanguagesModule
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

});

// helpers //////////

/**
 * @param {HTMLElement} input
 * @param {string} value
 */
function changeInput(input, value) {
  return act(() => input.textContent = value);
}

function act(fn) {
  fn();
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}
