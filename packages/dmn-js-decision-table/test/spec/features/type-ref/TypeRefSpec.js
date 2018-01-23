import { bootstrapModeler, inject } from 'test/helper';

import { triggerChangeEvent, triggerMouseEvent } from 'test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import TypeRefModule from 'lib/features/type-ref';


describe('type ref', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      TypeRefModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should edit type ref', inject(function(elementRegistry) {

    // given
    const cell = domQuery('.type-ref', testContainer);

    triggerMouseEvent(cell, 'click');

    const select = domQuery('.type-ref-edit-select', testContainer);

    // when
    triggerChangeEvent(select, 'boolean');

    // then
    expect(
      elementRegistry.get('input1').businessObject.inputExpression.typeRef
    ).to.equal('boolean');
  }));

});