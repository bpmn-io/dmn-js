import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTablePropertiesEditorModule from
  'src/features/decision-table-properties/editor';
import HitPolicyEditorModule from 'src/features/hit-policy/editor';
import ModelingModule from 'src/features/modeling';
import KeyboardModule from 'src/features/keyboard';


describe('features/hit-policy - editor', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTablePropertiesEditorModule,
      HitPolicyEditorModule,
      ModelingModule,
      KeyboardModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render hit policy cell', function() {

    // then
    expect(domQuery('.hit-policy', testContainer)).to.exist;
  });


  describe('hit policy editing', function() {

    let inputSelect, root;

    beforeEach(inject(function(sheet) {
      inputSelect = domQuery('.hit-policy-edit-policy-select', testContainer);

      root = sheet.getRoot();
    }));


    it('should edit hit policy', inject(function(sheet) {

      // when
      triggerClick(inputSelect);

      const option = domQuery('.options .option:nth-child(2)', testContainer);

      triggerClick(option);

      // then
      expect(root.businessObject.hitPolicy).to.equal('FIRST');
    }));


    it('should set hit policy and aggregation', inject(function(sheet) {

      // when
      triggerClick(inputSelect);

      const option = domQuery('.options .option:nth-child(7)', testContainer);

      triggerClick(option);

      // then
      expect(root.businessObject.hitPolicy).to.equal('COLLECT');
      expect(root.businessObject.aggregation).to.equal('MIN');
    }));
  });

});