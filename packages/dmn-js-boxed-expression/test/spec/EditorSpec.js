import { expect } from 'chai';
import TestContainer from 'mocha-test-container-support';

import axe from 'axe-core';

import Editor from '../helper/Editor';

import { insertCSS } from '../helper';

import decisionXML from './empty-literal-expression.dmn';
import bkmXML from './bkm-literal-expression.dmn';
import bkmEmptyXML from './bkm-empty-literal-expression.dmn';


const singleStart = window.__env__ && window.__env__.SINGLE_START === 'editor';

if (singleStart) {
  insertCSS('dmn-js-boxed-expression-single-start.css',
    'html, body, .test-container { margin: 0; height: 100%; }'
  );
}


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
    return createEditor(decisionXML);
  });


  it('should import business knowledge model with empty literal expression', function() {
    return createEditor(bkmEmptyXML);
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
