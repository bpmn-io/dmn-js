import TestContainer from 'mocha-test-container-support';

import DmnDecisionTableEditor from '../helper/DecisionTableEditor';

import TestDecision from './simple.dmn';

describe('DecisionTable', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createDecisionTableEditor(xml, done) {
    const dmnDecisionTableEditor = new DmnDecisionTableEditor({
      container: testContainer,
      decisionTable: {
        keyboard: {
          bindTo: document
        }
      }
    });

    dmnDecisionTableEditor.importXML(xml, (err, warnings) => {
      done(err, warnings, dmnDecisionTableEditor);
    });
  }


  it('should import simple decision', function(done) {
    createDecisionTableEditor(TestDecision, done);
  });

});