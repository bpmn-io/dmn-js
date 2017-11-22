import Inferno from 'inferno';

import DmnDecisionTableViewer from '../helper/DecisionTable';

import simpleXML from './simple.dmn';

describe('DecisionTable', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  function createDecisionTable(xml, done) {
    const decisionTable = new DmnDecisionTableViewer({ container });

    decisionTable.importXML(xml, (err, warnings) => {
      done(err, warnings, decisionTable);
    });
  }


  it('should import simple decision', function(done) {
    createDecisionTable(simpleXML, done);
  });

});