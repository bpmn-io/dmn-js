
// eslint-disable-next-line
import Inferno from 'inferno';

import { insertCSS } from 'test/TestHelper';

import DecisionTableEditor from 'lib/DecisionTableEditor';

import TestDecision from './simple.dmn';
// import TestDecision from './performance.dmn';

import dmnNextCSS from 'assets/dmn-next.css';

insertCSS('dmn-next-css', dmnNextCSS);

describe('DecisionTable', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  function createDecisionTableEditor(xml, done) {
    const decisionTableEditor = window.decisionTableEditor = new DecisionTableEditor({ container });

    decisionTableEditor.importXML(xml, (err, warnings) => {
      done(err, warnings, decisionTableEditor);
    });
  }


  it.only('should import simple decision', function(done) {
    createDecisionTableEditor(TestDecision, done);
  });

});