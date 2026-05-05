import TestContainer from 'mocha-test-container-support';

import DmnDecisionTableEditor from '../helper/DecisionTableEditor';

import { insertCSS } from '../helper';

import simpleDiagramXML from './simple.dmn';
import complexDiagramXML from './complex.dmn';

const singleStart = window.__env__ && window.__env__.SINGLE_START === 'editor';

if (singleStart) {
  insertCSS('dmn-js-decision-table-single-start.css',
    'html, body, .test-container { margin: 0; height: 100%; }'
  );
}


describe('DecisionTable', function() {

  let testContainer;

  let dmnJS;

  singleStart || afterEach(function() {
    if (dmnJS) {
      dmnJS.destroy();
      dmnJS = null;
    }
  });

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createDecisionTableEditor(xml) {
    dmnJS = new DmnDecisionTableEditor({
      container: testContainer
    });

    return dmnJS.importXML(xml);
  }


  it('should import simple decision', function() {
    return createDecisionTableEditor(simpleDiagramXML);
  });


  it('should import complex decision', function() {
    this.timeout(5000);

    return createDecisionTableEditor(complexDiagramXML);
  });

});
