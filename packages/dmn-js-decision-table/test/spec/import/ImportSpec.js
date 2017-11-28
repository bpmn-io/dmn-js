import TestContainer from 'mocha-test-container-support';

import DecisionTableViewer from '../../helper/DecisionTableViewer';

import dmnXML from './simple.dmn';

describe('import', function() {

  let dmnDecisionTableViewer;

  beforeEach(function() {
    const testContainer = TestContainer.get(this);

    dmnDecisionTableViewer = new DecisionTableViewer({ container: testContainer });
  });


  it('should import without errors and warnings', function(done) {
    dmnDecisionTableViewer.importXML(dmnXML, (err, importWarnings) => {
      expect(err).not.to.exist;
      expect(importWarnings).to.have.lengthOf(0);

      done();
    });
  });

});