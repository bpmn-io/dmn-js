import { expect } from 'chai';
import TestContainer from 'mocha-test-container-support';

import Viewer from '../../helper/Viewer';

import simpleXML from './simple.dmn';

import noInputXML from './no-input.dmn';
import noOutputXML from './no-output.dmn';
import noTableXML from './no-decision-table.dmn';
import noTableIdXML from './no-table-id.dmn';
import missingEntriesXML from './missing-entries.dmn';
import contextInFunctionXML from './context-in-function.dmn';
import contextInvalidTableXML from './context-invalid-table.dmn';
import contextXML from './context-two-tables.dmn';


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


  describe('several tables', function() {

    function getSheet() {
      return viewer.getActiveViewer().get('sheet');
    }


    it('should import all tables of a context', async function() {

      // when
      await viewer.importXML(contextXML);

      // then
      expect(getSheet().getRoots().map(root => root.id)).to.eql([
        'DecisionTable_discount',
        'DecisionTable_shipping'
      ]);
    });


    it('should import rows and cols of each table', async function() {

      // when
      await viewer.importXML(contextXML);

      // then
      const [ discount, shipping ] = getSheet().getRoots();

      expect([ discount.cols.length, discount.rows.length ]).to.eql([ 2, 2 ]);
      expect([ shipping.cols.length, shipping.rows.length ]).to.eql([ 3, 1 ]);
    });


    it('should keep first table as primary root', async function() {

      // when
      await viewer.importXML(contextXML);

      // then
      expect(getSheet().getRoot().id).to.equal('DecisionTable_discount');
    });


    it('should import tables of context in function', async function() {

      // when
      await viewer.importXML(contextInFunctionXML);

      // then
      expect(getSheet().getRoots().map(root => root.id)).to.eql([ 'DecisionTable_rate' ]);
    });


    it('should provide root of table', async function() {

      // given
      await viewer.importXML(contextXML);

      const table = viewer.getActiveViewer().getRootElement()
        .decisionLogic.contextEntry[1].value;

      // when
      const root = viewer.getActiveViewer().get('tableImporter').getRoot(table);

      // then
      expect(root.businessObject).to.equal(table);
    });


    it('should forget removed root', async function() {

      // given
      await viewer.importXML(contextXML);

      const [ , shipping ] = getSheet().getRoots();

      // when
      getSheet().removeRoot(shipping);

      // then
      expect(
        viewer.getActiveViewer().get('tableImporter').getRoot(shipping.businessObject)
      ).not.to.exist;
    });


    it('should import tables once', async function() {

      // given
      await viewer.importXML(contextXML);

      // when
      await viewer.importXML(contextXML);

      // then
      expect(getSheet().getRoots()).to.have.length(2);
    });


    it('should fail if any table is invalid', function() {
      return viewer.importXML(contextInvalidTableXML)
        .then(() => {
          throw new Error('should not have resolved');
        })
        .catch(err => {
          expect(err).to.exist;
          expect(err.message).to.match(/missing output for <dmn:DecisionTable/);
        });
    });

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
