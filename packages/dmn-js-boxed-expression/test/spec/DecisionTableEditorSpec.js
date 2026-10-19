import { expect } from 'chai';
import TestContainer from 'mocha-test-container-support';

import axe from 'axe-core';

import Editor from '../helper/Editor';

import { insertCSS } from '../helper';

import simpleDiagramXML from './simple.dmn';
import complexDiagramXML from './complex.dmn';

const singleStart =
  window.__env__ && window.__env__.SINGLE_START === 'decision-table-editor';

if (singleStart) {
  insertCSS('dmn-js-decision-table-single-start.css',
    'html, body, .test-container { margin: 0; height: 100%; }'
  );
}


describe('DecisionTable editor', function() {

  let testContainer;

  let dmnJS;

  if (!singleStart) {
    afterEach(function() {
      if (dmnJS) {
        dmnJS.destroy();
        dmnJS = null;
      }
    });
  }

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createDecisionTableEditor(xml) {
    dmnJS = new Editor({
      container: testContainer
    });

    return dmnJS.importXML(xml);
  }


  (singleStart ? it.only : it)('should import simple decision', function() {
    return createDecisionTableEditor(simpleDiagramXML);
  });


  it('should import complex decision', function() {
    this.timeout(5000);

    return createDecisionTableEditor(complexDiagramXML);
  });


  describe('accessibility', function() {

    it('should report no issues', async function() {

      // given
      await createDecisionTableEditor(simpleDiagramXML);

      // when
      const results = await axe.run(testContainer, {
        rules: {
          'empty-table-header': { enabled: false }
        }
      });

      // then
      expect(results.passes).to.be.not.empty;
      expect(results.violations).to.be.empty;
    });

  });

});
