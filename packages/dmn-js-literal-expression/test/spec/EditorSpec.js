import TestContainer from 'mocha-test-container-support';

import DmnLiteralExpressionEditor from '../helper/LiteralExpressionEditor';

import simpleXML from './empty-literal-expression.dmn';


describe('Editor', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createEditor(xml) {
    const dmnLiteralExpressionEditor = window.editor = new DmnLiteralExpressionEditor({
      container: testContainer
    });

    return dmnLiteralExpressionEditor.importXML(xml);
  }


  it('should import literal expression', function() {
    return createEditor(simpleXML);
  });

});
