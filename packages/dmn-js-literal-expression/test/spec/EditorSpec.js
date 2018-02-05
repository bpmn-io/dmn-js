import TestContainer from 'mocha-test-container-support';

import DmnLiteralExpressionEditor from '../helper/LiteralExpressionEditor';

import simpleXML from './literal-expression.dmn';

require('../TestHelper');

describe('Editor', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createEditor(xml, done) {
    const dmnLiteralExpressionEditor = window.foo = new DmnLiteralExpressionEditor({
      container: testContainer
    });

    dmnLiteralExpressionEditor.importXML(xml, (err, warnings) => {
      done(err, warnings, dmnLiteralExpressionEditor);
    });
  }


  it.only('should import literal expression', function(done) {
    createEditor(simpleXML, done);
  });

});