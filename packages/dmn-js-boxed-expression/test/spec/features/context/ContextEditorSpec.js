import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import axe from 'axe-core';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import { bootstrapModeler, inject } from 'test/helper';

import contextXML from '../../context-two-tables.dmn';


describe('features/context - editor', function() {

  let testContainer;

  beforeEach(bootstrapModeler(contextXML, { debounceInput: false }));

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render editors of entries', function() {

    // then
    expect(domQueryAll('.hit-policy-edit-policy-select', testContainer)).to.have.length(2);
    expect(domQuery('.context-entry-value .cm-editor', testContainer)).to.exist;
  });


  it('should edit cell of table in entry', inject(function(modeling, sheet) {

    // given
    const [ , shipping ] = sheet.getRoots();

    const cell = shipping.rows[0].cells[2];

    // when
    modeling.editCell(cell, '20');

    // then
    expect(cell.businessObject.text).to.eql('20');
  }));


  it('should keep context entries on edit', inject(function(modeling, sheet) {

    // given
    const [ , shipping ] = sheet.getRoots();

    // when
    modeling.editCell(shipping.rows[0].cells[2], '20');

    // then
    expect(domQueryAll('.context-entry', testContainer)).to.have.length(3);
  }));


  describe('accessibility', function() {

    it('should report no issues', async function() {

      // when
      const results = await axe.run(testContainer, {
        rules: {
          'empty-table-header': { enabled: false }
        }
      });

      // then
      expect(results.passes).to.be.not.empty;
      expect(results.violations).to.be.empty;
    });

  });

});
