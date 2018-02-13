import { bootstrapModeler, inject } from 'test/helper';

import { triggerInputEvent, triggerMouseEvent } from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import InputExpressionModule from 'lib/features/input-expression';
import ModelingModule from 'lib/features/modeling';


describe('input expression', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      InputExpressionModule,
      ModelingModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should edit input expression', inject(function(elementRegistry) {

    // given
    const cell = domQuery('.input-expression', testContainer);

    triggerMouseEvent(cell, 'click');

    const input = domQuery('.input-expression-edit-input', testContainer);

    input.focus();

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(
      elementRegistry.get('input1').businessObject.inputExpression.text
    ).to.equal('foo');
  }));

});