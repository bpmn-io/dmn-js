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
import { expect } from 'chai';


describe('add rule', function() {

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


  it('should focus on the added row', inject(function(sheet, cellSelection) {

    // given
    const row = domQuery('.add-rule', testContainer);

    // when
    triggerClick(row);

    // then
    const rootRows = sheet.getRoot().rows;
    const addedCell = rootRows[rootRows.length - 1].cells[0].id;
    const selectedCell = cellSelection.getCellSelection();

    expect(addedCell).to.equal(selectedCell);

  }));
});