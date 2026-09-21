import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import { waitFor } from '@testing-library/dom';

import Editor from '../../../helper/Editor';

import functionDefinitionXML from '../function-definition/function-definition.dmn';


describe('ElementVariableEditor - integration', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should reflect a model change to the function body type in the UI', async function() {

    // given
    const editor = new Editor({ container: testContainer });

    await editor.importXML(functionDefinitionXML);

    const boxedExpressionEditor = editor.getActiveViewer();

    const viewer = boxedExpressionEditor.get('viewer');
    const modeling = boxedExpressionEditor.get('modeling');

    const bkm = viewer.getRootElement();
    const body = bkm.get('encapsulatedLogic').get('body');

    const input = testContainer.querySelector('#dmn-boxed-expression-variable-type');

    expect(input.value).to.equal('Any');

    // when
    modeling.updateProperties(body, { typeRef: 'number' });

    // then
    await waitFor(() => {
      expect(input.value).to.equal('number');
    });
  });


  it('should persist the result type on the function body, not the variable', async function() {

    // given
    const editor = new Editor({ container: testContainer });

    await editor.importXML(functionDefinitionXML);

    const boxedExpressionEditor = editor.getActiveViewer();

    const elementVariable = boxedExpressionEditor.get('elementVariable');

    // when
    elementVariable.setType('number');

    const { xml } = await editor.saveXML();

    // then
    expect(xml).to.match(/<literalExpression[^>]*typeRef="number"/);
    expect(xml).to.not.match(/<variable[^>]*typeRef="number"/);
  });
});
