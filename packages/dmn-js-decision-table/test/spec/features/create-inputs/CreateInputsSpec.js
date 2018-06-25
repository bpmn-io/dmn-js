import { bootstrapModeler, inject } from 'test/helper';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from './no-inputs.dmn';

import CoreModule from 'src/core';
import CreateInputsModule from 'src/features/create-inputs';
import DecisionRulesModule from 'src/features/decision-rules';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import ModelingModule from 'src/features/modeling';


describe('features/create-inputs', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      CreateInputsModule,
      DecisionRulesModule,
      DecisionTableHeadModule,
      ModelingModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render if no inputs', function() {

    // then
    expect(domQueryAll('.create-inputs', testContainer)).to.have.length(2);
  });


  it('should add first input', inject(function(sheet) {

    // given
    const { businessObject } = sheet.getRoot();

    const cell = domQuery('.create-inputs', testContainer);

    // when
    triggerClick(cell);

    // then
    expect(businessObject.input).to.have.length(1);
  }));

});