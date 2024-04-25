import TestContainer from 'mocha-test-container-support';

import axe from 'axe-core';

import Editor from '../helper/Editor';

import simpleXML from './empty-literal-expression.dmn';
import bkmXML from './bkm-literal-expression.dmn';


const singleStart = window.__env__ && window.__env__.SINGLE_START === 'editor';


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


  it('should import decision', function() {
    return createEditor(simpleXML);
  });


  (singleStart ? it.only : it)('should import business knowledge model', function() {
    return createEditor(bkmXML);
  });


  describe('accessibility', function() {

    it('should report no issues', async function() {

      // given
      await createEditor(bkmXML);

      // when
      const results = await axe.run(testContainer);

      // then
      expect(results.passes).to.be.not.empty;
      expect(results.violations).to.be.empty;
    });
  });

});
