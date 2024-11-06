import TestContainer from 'mocha-test-container-support';

import DmnDecisionTableEditor from '../helper/DecisionTableEditor';

import simpleDiagramXML from './simple.dmn';
import complexDiagramXML from './complex.dmn';


describe('DecisionTable', function() {

  let testContainer;

  let dmnJS;

  afterEach(function() {
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
