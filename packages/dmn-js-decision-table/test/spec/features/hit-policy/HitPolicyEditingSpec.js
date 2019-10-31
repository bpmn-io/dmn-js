import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerInputSelectChange,
  triggerClick,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import HitPolicyEditorModule from 'src/features/hit-policy/editor';
import ModelingModule from 'src/features/modeling';
import KeyboardModule from 'src/features/keyboard';


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


      it('should remove aggregation when NO LIST AGGREGATION is selected', function() {

        // given
        triggerInputSelectChange(inputSelect, 'COLLECT');

        const aggregationInputSelect = domQuery(
          '.hit-policy-edit-operator-select',
          testContainer
        );

        // when
        triggerInputSelectChange(aggregationInputSelect);

        // then
        expect(root.businessObject.aggregation).to.not.exist;
      });


      it('should NOT remove aggregation when COLLECT policy is selected again',
        function() {

          // given
          triggerInputSelectChange(inputSelect, 'COLLECT');

          const aggregationInputSelect = domQuery(
            '.hit-policy-edit-operator-select',
            testContainer
          );

          triggerInputSelectChange(aggregationInputSelect, 'SUM');

          // when
          triggerInputSelectChange(inputSelect, 'COLLECT');

          // then
          expect(root.businessObject.aggregation).to.equal('SUM');
        }
      );


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


    describe('integration', function() {

      it('should not close context menu when select option is chosen', function() {

        // given
        triggerMouseEvent(inputSelect, 'click');

        const option = domQuery('.option[data-value="COLLECT"]', testContainer);

        // when
        triggerMouseEvent(option, 'mousedown');
        triggerMouseEvent(option, 'mouseup');
        triggerMouseEvent(option, 'click');

        // then
        expect(domQuery('.hit-policy-edit-operator-select', testContainer)).to.exist;
      });

    });

  });

});