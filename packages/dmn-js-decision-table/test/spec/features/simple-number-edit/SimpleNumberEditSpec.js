import { bootstrapModeler, inject } from 'test/helper';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerInputEvent,
  triggerInputSelectChange,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import simpleNumberEditXML from './simple-number-edit.dmn';

import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import SimpleNumberEditModule from 'src/features/simple-number-edit';


describe('simple number edit', function() {

  beforeEach(bootstrapModeler(simpleNumberEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule,
      SimpleNumberEditModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('InputClause', function() {

    describe('comparison', function() {

      let simpleNumberEdit,
          inputEntry4;

      beforeEach(inject(function(elementRegistry) {
        const cell = domQuery('[data-element-id="inputEntry4"]', testContainer);

        triggerClick(cell);

        const button = domQuery('.simple-mode-button', testContainer);

        triggerClick(button);

        simpleNumberEdit = domQuery('.simple-number-edit', testContainer);

        inputEntry4 = elementRegistry.get('inputEntry4');
      }));


      it('should render', function() {

        // then
        expect(simpleNumberEdit).to.exist;
      });


      it('should set to range', function() {

        // given
        const select = domQuery('.dms-input-select', simpleNumberEdit);

        // when
        triggerInputSelectChange(select, 'range', testContainer);

        // then
        expect(inputEntry4.businessObject.text).to.equal('[0..0]');
      });


      it('should set to comparison restoring previously set comparison', function() {

        // given
        const select = domQuery('.dms-input-select', simpleNumberEdit);

        triggerInputSelectChange(select, 'range', testContainer);

        // when
        triggerInputSelectChange(select, 'comparison', testContainer);

        // then
        expect(inputEntry4.businessObject.text).to.equal('< 1000');
      });


      it('should edit operator', function() {

        // given
        const select = domQueryAll('.dms-input-select', simpleNumberEdit)[1];

        // when
        triggerInputSelectChange(select, 'greater', testContainer);

        // then
        expect(inputEntry4.businessObject.text).to.equal('> 1000');
      });


      it('should edit value', function() {

        // given
        const input = domQuery('.comparison-number-input', simpleNumberEdit);

        // when
        triggerInputEvent(input, '42');

        // then
        expect(inputEntry4.businessObject.text).to.equal('< 42');
      });

    });


    describe('range', function() {

      let simpleNumberEdit,
          inputEntry2;

      beforeEach(inject(function(elementRegistry) {
        const cell = domQuery('[data-element-id="inputEntry2"]', testContainer);

        triggerClick(cell);

        const button = domQuery('.simple-mode-button', testContainer);

        triggerClick(button);

        simpleNumberEdit = domQuery('.simple-number-edit', testContainer);

        inputEntry2 = elementRegistry.get('inputEntry2');
      }));


      it('should render', function() {

        // then
        expect(simpleNumberEdit).to.exist;
      });


      it('should set to comparison', function() {

        // given
        const select = domQuery('.dms-input-select', simpleNumberEdit);

        // when
        triggerInputSelectChange(select, 'comparison', testContainer);

        // then
        expect(inputEntry2.businessObject.text).to.equal('0');
      });


      it('should set to range restoring previously set range', function() {

        // given
        const select = domQuery('.dms-input-select', simpleNumberEdit);

        triggerInputSelectChange(select, 'comparison');

        // when
        triggerInputSelectChange(select, 'range', testContainer);

        // then
        expect(inputEntry2.businessObject.text).to.equal('[10..20[');
      });


      it('should edit range start type', function() {

        // given
        const select = domQueryAll('.dms-input-select', simpleNumberEdit)[1];

        // when
        triggerInputSelectChange(select, 'exclude', testContainer);

        // then
        expect(inputEntry2.businessObject.text).to.equal(']10..20[');
      });


      it('should edit range start value', function() {

        // given
        const input = domQuery('.range-start-number-input', simpleNumberEdit);

        // when
        triggerInputEvent(input, '42');

        // then
        expect(inputEntry2.businessObject.text).to.equal('[42..20[');
      });


      it('should edit range end type', function() {

        // given
        const select = domQueryAll('.dms-input-select', simpleNumberEdit)[2];

        // when
        triggerInputSelectChange(select, 'include', testContainer);

        // then
        expect(inputEntry2.businessObject.text).to.equal('[10..20]');
      });


      it('should edit range end value', function() {

        // given
        const input = domQuery('.range-end-number-input', simpleNumberEdit);

        // when
        triggerInputEvent(input, '42');

        // then
        expect(inputEntry2.businessObject.text).to.equal('[10..42[');
      });

    });

  });


  describe('OutputClause', function() {

    let simpleNumberEdit,
        outputEntry9;

    beforeEach(inject(function(elementRegistry) {
      const cell = domQuery('[data-element-id="outputEntry9"]', testContainer);

      triggerClick(cell);

      const button = domQuery('.simple-mode-button', testContainer);

      triggerClick(button);

      simpleNumberEdit = domQuery('.simple-number-edit', testContainer);

      outputEntry9 = elementRegistry.get('outputEntry9');
    }));


    it('should render', function() {

      // then
      expect(simpleNumberEdit).to.exist;
    });


    it('should edit value', function() {

      // given
      const input = domQuery('.dms-input', simpleNumberEdit);

      // when
      triggerInputEvent(input, '42');

      // then
      expect(outputEntry9.businessObject.text).to.equal('42');
    });

  });

});