import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerInputEvent,
  triggerInputSelectChange,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import HitPolicyEditorModule from 'lib/features/hit-policy/editor';
import ModelingModule from 'lib/features/modeling';
import KeyboardModule from 'lib/features/keyboard';


describe('features/hit-policy - editor', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
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
    expect(domQuery('th.hit-policy', testContainer)).to.exist;
  });


  describe('hit policy editing', function() {

    let inputSelect, root;

    beforeEach(inject(function(sheet) {
      const cell = domQuery('th.hit-policy', testContainer);

      triggerClick(cell);

      inputSelect = domQuery('.hit-policy-edit-policy-select', testContainer);

      root = sheet.getRoot();
    }));


    it('should edit hit policy - input', inject(function(sheet) {

      // given
      const input = domQuery('.dms-input', inputSelect);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(root.businessObject.hitPolicy).to.equal('foo');
    }));


    it('should edit hit policy - select', inject(function(sheet) {

      // when
      triggerInputSelectChange(inputSelect, 'FIRST');

      // then
      expect(root.businessObject.hitPolicy).to.equal('FIRST');
    }));


    describe('aggregation', function() {

      it('should render aggregation select', function() {

        // when
        triggerInputSelectChange(inputSelect, 'COLLECT');

        // then
        expect(domQuery('.hit-policy-edit-operator-select', testContainer)).to.exist;
      });


      it('should edit aggregation - input', inject(function(sheet) {

        // given
        triggerInputSelectChange(inputSelect, 'COLLECT');

        const aggregationInputSelect = domQuery(
          '.hit-policy-edit-operator-select',
          testContainer
        );

        const input = domQuery('.dms-input', aggregationInputSelect);

        // when
        triggerInputEvent(input, 'foo');

        // then
        expect(root.businessObject.aggregation).to.equal('foo');
      }));


      it('should edit aggregation - select', inject(function(sheet) {

        // given
        triggerInputSelectChange(inputSelect, 'COLLECT');

        const aggregationInputSelect = domQuery(
          '.hit-policy-edit-operator-select',
          testContainer
        );

        // when
        triggerInputSelectChange(aggregationInputSelect, 'SUM');

        // then
        expect(root.businessObject.aggregation).to.equal('SUM');
      }));


      it('should remove aggregation', inject(function(sheet) {

        // given
        triggerInputSelectChange(inputSelect, 'COLLECT');

        const aggregationSelect = domQuery(
          '.hit-policy-edit-operator-select',
          testContainer
        );

        triggerInputSelectChange(aggregationSelect, 'SUM');

        // when
        triggerInputSelectChange(inputSelect, 'FIRST');

        // then
        expect(root.businessObject.aggregation).to.not.exist;
      }));

    });

  });

});