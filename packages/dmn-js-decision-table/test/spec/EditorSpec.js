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


  it('should import simple decision', function(done) {
    createDecisionTableEditor(simpleDiagramXML, done);
  });


  it('should import complex decision', function(done) {
    this.timeout(5000);

    createDecisionTableEditor(complexDiagramXML, done);
  });

});