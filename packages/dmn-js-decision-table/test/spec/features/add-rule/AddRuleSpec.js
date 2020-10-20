import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import AddRuleModule from 'src/features/add-rule';
import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';


describe('add input output', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      AddRuleModule,
      CoreModule,
      ModelingModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render table foot', function() {

    // then
    const addRuleEl = domQuery('.add-rule', testContainer);

    expect(addRuleEl).to.exist;
  });


  it('should render cell placeholders', function() {

    // then
    const addRuleEl = domQuery('.add-rule', testContainer);

    // structure = INPUT | INPUT || OUTPUT | OUTPUT | ANNOTATION
    // placeholders shown for the two inputs only
    expect(addRuleEl.textContent).to.eql('--');
  });


  it('should add rule on click', inject(function(sheet) {

    // given
    const row = domQuery('.add-rule', testContainer);

    // when
    triggerClick(row);

    // then
    const root = sheet.getRoot();

    expect(root.rows).to.have.lengthOf(5);
  }));


  it('should select cell in column which was clicked',
    inject(function(cellSelection, sheet) {

      // given
      const addRuleCell = domQuery('.add-rule[data-col-index="2"]', testContainer);

      // when
      triggerClick(addRuleCell);

      // then
      const rootRows = sheet.getRoot().rows;
      const addedCell = rootRows[rootRows.length - 1].cells[2].id;
      const selectedCell = cellSelection.getCellSelection();

      expect(addedCell).to.equal(selectedCell);
    })
  );


  it('should focus on the first cell when the plus button is clicked',
    inject(function(cellSelection, sheet) {

      // given
      const plusButton = domQuery('.add-rule-add', testContainer);

      // when
      triggerClick(plusButton);

      // then
      const rootRows = sheet.getRoot().rows;
      const addedCell = rootRows[rootRows.length - 1].cells[0].id;
      const selectedCell = cellSelection.getCellSelection();

      expect(addedCell).to.equal(selectedCell);
    })
  );


  // TODO(philippfromme): should not be hard coded to include indices and annotations
  it('should have correct number of columns', inject(function(sheet) {

    // given
    const { cols } = sheet.getRoot();

    const row = domQuery('.add-rule tr', testContainer);

    // then
    expect(
      row.childNodes
    ).to.have.lengthOf(cols.length + 2); // + 2 for indices and annotations
  }));

});
