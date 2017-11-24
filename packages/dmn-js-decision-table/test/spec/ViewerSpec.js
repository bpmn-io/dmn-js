import TestContainer from 'mocha-test-container-support';

import DmnDecisionTableViewer from '../helper/DecisionTableViewer';

import simpleXML from './simple.dmn';

describe('DecisionTable', function() {

  let testContainer;
  
  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createDecisionTable(xml, done) {
    const decisionTable = new DmnDecisionTableViewer({ container: testContainer });

    decisionTable.importXML(xml, (err, warnings) => {
      done(err, warnings, decisionTable);
    });
  }


  it('should import simple decision', function(done) {
    createDecisionTable(simpleXML, done);
  });

});