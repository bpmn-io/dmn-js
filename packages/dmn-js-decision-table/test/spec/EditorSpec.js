import TestContainer from 'mocha-test-container-support';

import DmnDecisionTableEditor from '../helper/DecisionTableEditor';

import diagramXML from './simple.dmn';


describe('DecisionTable', function() {

  let testContainer;

  let dmnJS;

  // afterEach(function() {
  //   if (dmnJS) {
  //     dmnJS.destroy();
  //     dmnJS = null;
  //   }
  // });

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createDecisionTableEditor(xml, done) {
    dmnJS = new DmnDecisionTableEditor({
      container: testContainer,
      decisionTable: {
        keyboard: {
          bindTo: document
        }
      }
    });

    dmnJS.importXML(xml, (err, warnings) => {
      done(err, warnings, dmnJS);
    });
  }


  it.only('should import simple decision', function(done) {
    createDecisionTableEditor(diagramXML, done);
  });

});