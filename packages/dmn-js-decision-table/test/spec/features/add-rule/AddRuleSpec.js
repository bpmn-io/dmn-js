require('../../../TestHelper');

/* global bootstrapModeler, inject */

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerMouseEvent } from '../../../util/EventUtil';

import simpleXML from '../../simple.dmn';

import AddRuleModule from '../../../../lib/features/add-rule';
import CoreModule from '../../../../lib/core';


describe('add input output', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      AddRuleModule,
      CoreModule
    ]
  }));

  let testContainer;

  beforeEach(function() {    
    testContainer = TestContainer.get(this);
  });


  it('should render table foot', function() {

    // then
    expect(domQuery('.add-rule', testContainer)).to.exist;
  });


  it('should add rule on click', inject(function(sheet) {
      
    // given
    const row = domQuery('.add-rule', testContainer);

    // when
    triggerMouseEvent(row, 'click');

    // then
    const root = sheet.getRoot();

    expect(root.businessObject.rule).to.have.lengthOf(5);
  }));


  // TODO(philippfromme): should not be hard coded to include indices and annotations
  it('should have correct number of columns', inject(function(sheet) {

    // given
    const { cols } = sheet.getRoot();

    const row = domQuery('.add-rule', testContainer);

    // then
    expect(row.childNodes).to.have.lengthOf(cols.length + 2); // + 2 for indices and annotations
  }));

});