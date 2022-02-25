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

import simpleDurationEditXML from './simple-duration-edit.dmn';

import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import SimpleDurationEditModule from 'src/features/simple-duration-edit';


describe('simple duration edit', function() {

  beforeEach(bootstrapModeler(simpleDurationEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule,
      SimpleDurationEditModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('basics', function() {

    it('should open empty input', function() {

      // when
      const simpleEdit = openSimpleEdit('emptyInputEntry', testContainer);

      // then
      expect(simpleEdit).to.exist;
    });


    it('should open empty output', function() {

      // when
      const simpleEdit = openSimpleEdit('emptyOutputEntry', testContainer);

      // then
      expect(simpleEdit).to.exist;
    });
  });


  describe('InputClause', function() {

    describe('comparison', function() {

      let simpleDurationEdit,
          inputEntry4;

      beforeEach(inject(function(elementRegistry) {
        simpleDurationEdit = openSimpleEdit('inputEntry4', testContainer);

        inputEntry4 = elementRegistry.get('inputEntry4');
      }));


      it('should render', function() {

        // then
        expect(simpleDurationEdit).to.exist;
      });


      it('should set to range', function() {

        // given
        const select = domQuery('.dms-input-select', simpleDurationEdit);

        // when
        triggerInputSelectChange(select, 'range', testContainer);

        // then
        expect(
          inputEntry4.businessObject.text).to.equal('[duration("P1M")..duration("")]');
      });


      it('should set to comparison restoring previously set comparison', function() {

        // given
        const select = domQuery('.dms-input-select', simpleDurationEdit);

        triggerInputSelectChange(select, 'range', testContainer);

        // when
        triggerInputSelectChange(select, 'comparison', testContainer);

        // then
        expect(inputEntry4.businessObject.text).to.equal('< duration("P1M")');
      });


      it('should set to first value of range when set to comparison', inject(
        function(elementRegistry) {

          // given
          const simpleDurationEdit = openSimpleEdit('inputEntry2', testContainer);
          const select = domQuery('.dms-input-select', simpleDurationEdit);
          const inputEntry2 = elementRegistry.get('inputEntry2');

          // when
          triggerInputSelectChange(select, 'comparison', testContainer);

          // then
          expect(inputEntry2.businessObject.text).to.equal('duration("P1M")');
        })
      );


      it('should edit operator', function() {

        // given
        const select = domQueryAll('.dms-input-select', simpleDurationEdit)[1];

        // when
        triggerInputSelectChange(select, 'greater', testContainer);

        // then
        expect(inputEntry4.businessObject.text).to.equal('> duration("P1M")');
      });


      it('should edit value', function() {

        // given
        const input = domQuery('.comparison-duration-input input', simpleDurationEdit);

        // when
        triggerInputEvent(input, 'P2M');

        // then
        expect(inputEntry4.businessObject.text).to.equal('< duration("P2M")');
      });

    });


    describe('range', function() {

      let simpleDurationEdit,
          inputEntry2;

      beforeEach(inject(function(elementRegistry) {
        simpleDurationEdit = openSimpleEdit('inputEntry2', testContainer);

        inputEntry2 = elementRegistry.get('inputEntry2');
      }));


      it('should render', function() {

        // then
        expect(simpleDurationEdit).to.exist;
      });


      it('should set to comparison', function() {

        // given
        const select = domQuery('.dms-input-select', simpleDurationEdit);

        // when
        triggerInputSelectChange(select, 'comparison', testContainer);

        // then
        expect(inputEntry2.businessObject.text).to.equal('duration("P1M")');
      });


      it('should set to range restoring previously set range', function() {

        // given
        const select = domQuery('.dms-input-select', simpleDurationEdit);

        triggerInputSelectChange(select, 'comparison');

        // when
        triggerInputSelectChange(select, 'range', testContainer);

        // then
        expect(
          inputEntry2.businessObject.text).to.equal('[duration("P1M")..duration("P2M")[');
      });


      it('should edit range start type', function() {

        // given
        const select = domQueryAll('.dms-input-select', simpleDurationEdit)[1];

        // when
        triggerInputSelectChange(select, 'exclude', testContainer);

        // then
        expect(
          inputEntry2.businessObject.text).to.equal(']duration("P1M")..duration("P2M")[');
      });


      it('should edit range start value', function() {

        // given
        const input = domQuery('.range-start-duration-input input', simpleDurationEdit);

        // when
        triggerInputEvent(input, 'P2M');

        // then
        expect(
          inputEntry2.businessObject.text).to.equal('[duration("P2M")..duration("P2M")[');
      });


      it('should edit range end type', function() {

        // given
        const select = domQueryAll('.dms-input-select', simpleDurationEdit)[2];

        // when
        triggerInputSelectChange(select, 'include', testContainer);

        // then
        expect(
          inputEntry2.businessObject.text).to.equal('[duration("P1M")..duration("P2M")]');
      });


      it('should edit range end value', function() {

        // given
        const input = domQuery('.range-end-duration-input input', simpleDurationEdit);

        // when
        triggerInputEvent(input, 'P1Y1M');

        // then
        expect(inputEntry2.businessObject.text).to.equal(
          '[duration("P1M")..duration("P1Y1M")[');
      });

    });

  });


  describe('OutputClause', function() {

    let simpleDurationEdit,
        outputEntry9;

    beforeEach(inject(function(elementRegistry) {
      simpleDurationEdit = openSimpleEdit('outputEntry9', testContainer);

      outputEntry9 = elementRegistry.get('outputEntry9');
    }));


    it('should render', function() {

      // then
      expect(simpleDurationEdit).to.exist;
    });


    it('should edit value', function() {

      // given
      const input = domQuery('.dms-input', simpleDurationEdit);

      // when
      triggerInputEvent(input, 'P2D');

      // then
      expect(outputEntry9.businessObject.text).to.equal('duration("P2D")');
    });


    it('should commit invalid value', function() {

      // given
      const input = domQuery('.dms-input', simpleDurationEdit);

      // when
      triggerInputEvent(input, '42');

      // then
      expect(outputEntry9.businessObject.text).to.equal('duration("42")');
    });

  });

});


// helper //////////
function openSimpleEdit(elementId, container) {
  const cell = domQuery(`[data-element-id="${elementId}"]`, container);

  triggerClick(cell);

  const button = domQuery('.simple-mode-button', container);

  triggerClick(button);

  return domQuery('.simple-duration-edit', container);
}
