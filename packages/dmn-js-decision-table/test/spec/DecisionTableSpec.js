import { insertCSS } from 'test/TestHelper';

import Inferno from 'inferno';

import DecisionTable from 'lib/DecisionTable';

import simpleXML from './simple.dmn';

import dmnNextCSS from 'assets/dmn-next.css';

insertCSS('dmn-next-css', dmnNextCSS);

describe('DecisionTable', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  function createDecisionTable(xml, done) {
    const decisionTable = window.decisionTable = new DecisionTable({ container });

    decisionTable.importXML(xml, (err, warnings) => {
      done(err, warnings, decisionTable);
    });
  }


  it('should import simple decision', function(done) {
    createDecisionTable(simpleXML, done);
  });

});