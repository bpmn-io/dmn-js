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


  it('should import without errors and warnings', async function() {
    const { warnings: importWarnings } = await viewer.importXML(simpleXML);

    expect(importWarnings).to.have.lengthOf(0);
  });


  describe('errors', function() {

    it('should handle missing input(s)', function() {
      return viewer.importXML(noInputXML);
    });


    it('should handle missing output(s)', function() {
      return viewer.importXML(noOutputXML)
        .then(() => {
          throw new Error('should not have resolved');
        })
        .catch(err => {
          expect(err).to.exist;
          expect(err.message).to.match(/missing output/);
        });
    });


    it('should handle missing table', function() {
      return viewer.importXML(noTableXML)
        .then(() => {
          throw new Error('should not have resolved');
        })
        .catch(err => {
          expect(err).to.exist;
          expect(err.message).to.match(/no displayable contents/);
        });
    });

  });

});
