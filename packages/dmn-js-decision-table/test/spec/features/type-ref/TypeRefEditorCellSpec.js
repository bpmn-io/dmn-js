import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerClick,
  triggerInputSelectChange
} from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import typeRefXML from './TypeRef.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import ModelingModule from 'src/features/modeling';
import TypeRefModule from 'src/features/type-ref';
import KeyboardModule from 'src/features/keyboard';


describe('features/type-ref', function() {

  beforeEach(bootstrapModeler(typeRefXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      ModelingModule,
      TypeRefModule,
      KeyboardModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should edit type ref', inject(function(elementRegistry) {

    // given
    const cell = domQuery('.type-ref', testContainer);

    triggerClick(cell);

    const input = domQuery('.type-ref-edit-select', testContainer);

    // when
    triggerInputSelectChange(input, 'boolean', testContainer);

    // then
    expect(
      elementRegistry.get('input1').businessObject.inputExpression.typeRef
    ).to.equal('boolean');
  }));

});