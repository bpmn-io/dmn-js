/* global sinon */

import { bootstrapModeler, inject } from 'test/helper';

import { waitFor } from '@testing-library/dom';

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

  const variableResolver = {
    getVariables: () => [
      { name: 'Variable', typeRef: 'string' }
    ]
  };

  beforeEach(bootstrapModeler(literalExpressionXML, {
    modules: [
      CoreModule,
      TextareaEditorModule,
      ModelingModule,
      ExpressionLanguagesModule,
      {
        variableResolver: [ 'value', variableResolver ]
      }
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


  it('should have accessible label', function() {

    // then
    expect(domQuery('[aria-label]', testContainer)).to.exist;
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

    afterEach(function() {
      sinon.restore();
    });


    it('should pass variables to editor', inject(async function(modeling) {

      // given
      const getVariablesSpy = sinon.spy(variableResolver, 'getVariables');

      // when
      modeling.editLiteralExpressionText('Var');

      // then
      await waitFor(() => {
        expect(getVariablesSpy).to.have.been.called;
      });
    }));
  });

});

// helpers //////////

/**
 * @param {HTMLElement} input
 * @param {string} value
 */
async function changeInput(input, value) {
  await act(() => input.textContent = value);
}

async function act(fn) {
  await fn();
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}
