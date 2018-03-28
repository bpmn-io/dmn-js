import TestContainer from 'mocha-test-container-support';

import DecisionTableViewer from '../../helper/DecisionTableViewer';

import simpleXML from './simple.dmn';

import noInputXML from './no-input.dmn';
import noOutputXML from './no-output.dmn';
import noTableXML from './no-decision-table.dmn';


describe('import', function() {

  let viewer;

  beforeEach(function() {
    const testContainer = TestContainer.get(this);

    viewer = new DecisionTableViewer({ container: testContainer });
  });


  it('should import without errors and warnings', function(done) {
    viewer.importXML(simpleXML, (err, importWarnings) => {
      expect(err).not.to.exist;
      expect(importWarnings).to.have.lengthOf(0);

      done();
    });
  });


  describe('errors', function() {

    it('should handle missing input(s)', function(done) {
      viewer.importXML(noInputXML, (err, importWarnings) => {

        expect(err).not.to.exist;

        done();
      });
    });


    it('should handle missing output(s)', function(done) {
      viewer.importXML(noOutputXML, (err, importWarnings) => {

        expect(err).to.exist;
        expect(err.message).to.match(/missing output/);

        done();
      });
    });


    it('should handle missing table', function(done) {
      viewer.importXML(noTableXML, (err, importWarnings) => {

        expect(err).to.exist;
        expect(err.message).to.match(/no displayable contents/);

        done();
      });
    });

  });

});