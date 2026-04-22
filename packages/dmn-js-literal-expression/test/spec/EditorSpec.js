import TestContainer from 'mocha-test-container-support';

import DmnLiteralExpressionEditor from '../helper/LiteralExpressionEditor';

import { insertCSS } from '../helper';

import simpleXML from './empty-literal-expression.dmn';

const singleStart = window.__env__ && window.__env__.SINGLE_START === 'editor';

if (singleStart) {
  insertCSS('dmn-js-literal-expression-single-start.css',
    'html, body, .test-container { margin: 0; height: 100%; }'
  );
}


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
