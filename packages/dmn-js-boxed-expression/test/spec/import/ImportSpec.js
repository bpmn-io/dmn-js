import { expect } from 'chai';
import TestContainer from 'mocha-test-container-support';

import Viewer from '../../helper/Viewer';

import simpleXML from './simple.dmn';

import noInputXML from './no-input.dmn';
import noOutputXML from './no-output.dmn';
import noTableXML from './no-decision-table.dmn';
import noTableIdXML from './no-table-id.dmn';
import missingEntriesXML from './missing-entries.dmn';


describe('import', function() {

  let viewer, testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);

    viewer = new Viewer({ container: testContainer });
  });


  it('should import without errors and warnings', async function() {
    const { warnings: importWarnings } = await viewer.importXML(simpleXML);

    expect(importWarnings).to.have.lengthOf(0);
  });


  it('should import table without id', async function() {

    // when
    const { warnings } = await viewer.importXML(noTableIdXML);

    // then
    expect(warnings).to.have.lengthOf(0);
    expect(viewer.getActiveViewer().get('sheet').getRoot().id).to.match(/^root_/);
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


    it('should handle rule with missing entries', function() {
      return viewer.importXML(missingEntriesXML)
        .then(() => {
          throw new Error('should not have resolved');
        })
        .catch(err => {
          expect(err).to.exist;
          expect(err.message).to.match(/number of cells/);
        });
    });


    it('should recover from failed import', async function() {

      // given
      await viewer.importXML(noOutputXML).catch(() => {});

      // when
      const { warnings } = await viewer.importXML(simpleXML);

      // then
      expect(warnings).to.have.lengthOf(0);
      expect(testContainer.querySelector('.tjs-table')).to.exist;
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
