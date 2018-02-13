import { bootstrapModeler, inject } from 'test/helper';

import { triggerChangeEvent, triggerMouseEvent } from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import HitPolicyEditorModule from 'lib/features/hit-policy/editor';
import ModelingModule from 'lib/features/modeling';


describe('hit policy editor', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      HitPolicyEditorModule,
      ModelingModule
    ]
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

    let select, root;

    beforeEach(inject(function(sheet) {
      const cell = domQuery('th.hit-policy', testContainer);

      triggerMouseEvent(cell, 'click');

      select = domQuery('.hit-policy-edit-policy-select', testContainer);

      root = sheet.getRoot();
    }));


    it('should edit hit policy', inject(function(sheet) {

      // when
      triggerChangeEvent(select, 'FIRST');

      // then
      expect(root.businessObject.hitPolicy).to.equal('FIRST');
    }));


    describe('aggregation', function() {

      it('should render aggregation select', function() {

        // when
        triggerChangeEvent(select, 'COLLECT');

        // then
        expect(domQuery('.hit-policy-edit-operator-select', testContainer)).to.exist;
      });


      it('should edit aggregation', inject(function(sheet) {

        // given
        triggerChangeEvent(select, 'COLLECT');

        const aggregationSelect = domQuery(
          '.hit-policy-edit-operator-select',
          testContainer
        );

        // when
        triggerChangeEvent(aggregationSelect, 'SUM');

        // then
        expect(root.businessObject.aggregation).to.equal('SUM');
      }));


      it('should remove aggregation', inject(function(sheet) {

        // given
        triggerChangeEvent(select, 'COLLECT');

        const aggregationSelect = domQuery(
          '.hit-policy-edit-operator-select',
          testContainer
        );

        triggerChangeEvent(aggregationSelect, 'SUM');

        // when
        triggerChangeEvent(select, 'FIRST');

        // then
        expect(root.businessObject.aggregation).to.not.exist;
      }));

    });

  });

});