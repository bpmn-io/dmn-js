
// eslint-disable-next-line
import Inferno from 'inferno';

import DmnDecisionTableEditor from '../helper/DecisionTableEditor';

import TestDecision from './simple.dmn';

describe('DecisionTable', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  function createDecisionTableEditor(xml, done) {
    const dmnDecisionTableEditor = new DmnDecisionTableEditor({ container });

    dmnDecisionTableEditor.importXML(xml, (err, warnings) => {
      done(err, warnings, dmnDecisionTableEditor);
    });
  }


  it('should import simple decision', function(done) {
    createDecisionTableEditor(TestDecision, done);
  });

});