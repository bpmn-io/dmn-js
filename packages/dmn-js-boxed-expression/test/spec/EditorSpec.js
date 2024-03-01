import TestContainer from 'mocha-test-container-support';

import Editor from '../helper/Editor';

import simpleXML from './empty-literal-expression.dmn';


describe('Editor', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createEditor(xml) {
    const editor = window.editor = new Editor({
      container: testContainer
    });

    return editor.importXML(xml);
  }


  it('should import diagram', function() {
    return createEditor(simpleXML);
  });

});
