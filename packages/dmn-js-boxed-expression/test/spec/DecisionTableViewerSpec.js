import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import axe from 'axe-core';

import Viewer from '../helper/Viewer';

import { insertCSS } from '../helper';

import simpleDiagramXML from './simple.dmn';
import complexDiagramXML from './complex.dmn';
import twoDecisionsXML from './two-decisions.dmn';

const singleStart =
  window.__env__ && window.__env__.SINGLE_START === 'decision-table-viewer';

if (singleStart) {
  insertCSS('dmn-js-decision-table-single-start.css',
    'html, body, .test-container { margin: 0; height: 100%; }'
  );
}


describe('DecisionTable viewer', function() {

  let testContainer;

  let dmnJS;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  if (!singleStart) {
    afterEach(function() {
      if (dmnJS) {
        dmnJS.destroy();
        dmnJS = null;
      }
    });
  }

  function createViewer(xml) {
    dmnJS = new Viewer({
      container: testContainer
    });

    return dmnJS.importXML(xml);
  }


  (singleStart ? it.only : it)('should import simple decision', function() {
    return createViewer(simpleDiagramXML);
  });


  it('should import complex decision', function() {
    this.timeout(5000);

    return createViewer(complexDiagramXML);
  });


  it('should render decision table in boxed expression container', async function() {

    // when
    await createViewer(simpleDiagramXML);

    // then
    expect(testContainer.querySelector(
      '.dmn-boxed-expression-container .dmn-decision-table-container .tjs-table'
    )).to.exist;
  });


  it('should render hit policy', async function() {

    // when
    await createViewer(simpleDiagramXML);

    // then
    expect(testContainer.querySelector('.decision-table-properties .hit-policy')).to.exist;
  });


  it('should re-open, clearing the previous table', async function() {

    // given
    await createViewer(twoDecisionsXML);

    const decisions = dmnJS.getViews().map(view => view.element);

    expect(decisions).to.have.length(2);

    // when
    await dmnJS.open(dmnJS.getViews()[1]);

    // then
    expect(testContainer.querySelectorAll('.tjs-table')).to.have.length(1);
    expect(dmnJS.getActiveViewer().get('sheet').getRoot().businessObject)
      .to.equal(decisions[1].decisionLogic);
  });


  describe('accessibility', function() {

    it('should report no issues', async function() {

      // given
      await createViewer(simpleDiagramXML);

      // when
      const results = await axe.run(testContainer, {
        rules: {
          'empty-table-header': { enabled: false },
          'scrollable-region-focusable': { enabled: false }
        }
      });

      // then
      expect(results.passes).to.be.not.empty;
      expect(results.violations).to.be.empty;
    });

  });

});
