import DecisionTable from 'lib/DecisionTable';

import dmnXML from './simple.dmn';

describe('import', function() {

  let decisionTable;

  beforeEach(function() {
    let container = document.createElement('div');
    
    document.body.appendChild(container);

    decisionTable = new DecisionTable({ container });
  });


  it('should import without errors and warnings', function(done) {
    decisionTable.importXML(dmnXML, (err, importWarnings) => {
      expect(err).not.to.exist;
      expect(importWarnings).to.have.lengthOf(0);

      done();
    });
  });

});