import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerChangeEvent,
  triggerInputEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import simpleNumberEditXML from './simple-number-edit.dmn';

import CoreModule from 'lib/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'lib/features/modeling';
import RulesEditorModule from 'lib/features/rules/editor';
import SimpleNumberEditModule from 'lib/features/simple-number-edit';


describe('simple number edit', function() {

  beforeEach(bootstrapModeler(simpleNumberEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      RulesEditorModule,
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

        triggerMouseEvent(cell, 'click');

        const button = domQuery('.simple-mode-button', testContainer);

        triggerMouseEvent(button, 'click');

        simpleNumberEdit = domQuery('.simple-number-edit', testContainer);

        inputEntry4 = elementRegistry.get('inputEntry4');
      }));


      it('should render', function() {

        // then
        expect(simpleNumberEdit).to.exist;
      });


      it('should set to range', function() {

        // given
        const select = domQuery('.select', simpleNumberEdit);

        // when
        triggerChangeEvent(select, 'range');

        // then
        expect(inputEntry4.businessObject.text).to.equal('[0..0]');
      });


      it('should set to comparison restoring previously set comparison', function() {

        // given
        const select = domQuery('.select', simpleNumberEdit);

        triggerChangeEvent(select, 'range');

        // when
        triggerChangeEvent(select, 'comparison');

        // then
        expect(inputEntry4.businessObject.text).to.equal('< 1000');
      });


      it('should edit operator', function() {

        // given
        const select = domQuery.all('.select', simpleNumberEdit)[1];

        // when
        triggerChangeEvent(select, 'greater');

        // then
        expect(inputEntry4.businessObject.text).to.equal('> 1000');
      });


      it('should edit value', function() {

        // given
        const input = domQuery('.input', simpleNumberEdit);

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

        triggerMouseEvent(cell, 'click');

        const button = domQuery('.simple-mode-button', testContainer);

        triggerMouseEvent(button, 'click');

        simpleNumberEdit = domQuery('.simple-number-edit', testContainer);

        inputEntry2 = elementRegistry.get('inputEntry2');
      }));


      it('should render', function() {

        // then
        expect(simpleNumberEdit).to.exist;
      });


      it('should set to comparison', function() {

        // given
        const select = domQuery('.select', simpleNumberEdit);

        // when
        triggerChangeEvent(select, 'comparison');

        // then
        expect(inputEntry2.businessObject.text).to.equal('0');
      });


      it('should set to range restoring previously set range', function() {

        // given
        const select = domQuery('.select', simpleNumberEdit);

        triggerChangeEvent(select, 'comparison');

        // when
        triggerChangeEvent(select, 'range');

        // then
        expect(inputEntry2.businessObject.text).to.equal('[10..20[');
      });


      it('should edit range start type', function() {

        // given
        const select = domQuery.all('.select', simpleNumberEdit)[1];

        // when
        triggerChangeEvent(select, 'exclude');

        // then
        expect(inputEntry2.businessObject.text).to.equal(']10..20[');
      });


      it('should edit range start value', function() {

        // given
        const input = domQuery('.input', simpleNumberEdit);

        // when
        triggerInputEvent(input, '42');

        // then
        expect(inputEntry2.businessObject.text).to.equal('[42..20[');
      });


      it('should edit range end type', function() {

        // given
        const select = domQuery.all('.select', simpleNumberEdit)[2];

        // when
        triggerChangeEvent(select, 'include');

        // then
        expect(inputEntry2.businessObject.text).to.equal('[10..20]');
      });


      it('should edit range end value', function() {

        // given
        const input = domQuery.all('.input', simpleNumberEdit)[1];

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

      triggerMouseEvent(cell, 'click');

      const button = domQuery('.simple-mode-button', testContainer);

      triggerMouseEvent(button, 'click');

      simpleNumberEdit = domQuery('.simple-number-edit', testContainer);

      outputEntry9 = elementRegistry.get('outputEntry9');
    }));


    it('should render', function() {

      // then
      expect(simpleNumberEdit).to.exist;
    });


    it('should edit value', function() {

      // given
      const input = domQuery('.input', simpleNumberEdit);

      // when
      triggerInputEvent(input, '42');

      // then
      expect(outputEntry9.businessObject.text).to.equal('42');
    });

  });

});