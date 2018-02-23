import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerChangeEvent,
  triggerInputEvent,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import simpleNumberEditXML from './simple-date-edit.dmn';

import CoreModule from 'lib/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'lib/features/modeling';
import RulesEditorModule from 'lib/features/rules/editor';
import SimpleDateEditModule from 'lib/features/simple-date-edit';

import { getSampleDate } from 'lib/features/simple-date-edit/Utils';


describe('simple date edit', function() {

  beforeEach(bootstrapModeler(simpleNumberEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      RulesEditorModule,
      SimpleDateEditModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function openSimpleDateEdit(elementId) {
    const cell = domQuery(`[data-element-id="${ elementId }"]`, testContainer);

    triggerClick(cell);

    const button = domQuery('.simple-mode-button', testContainer);

    triggerClick(button);

    return domQuery('.simple-date-edit', testContainer);
  }


  describe('InputClause', function() {

    it('should render', function() {

      // when
      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      // then
      expect(simpleDateEdit).to.exist;
    });


    it('should change type', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const select = domQuery('.dms-select', simpleDateEdit);

      // when
      triggerChangeEvent(select, 'before');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('< date and time("2018-01-25T00:00:00")');
    }));


    it('should edit start date', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '2000-01-01T00:00:00');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('date and time("2000-01-01T00:00:00")');
    }));


    it('should validate start date', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('date and time("2018-01-25T00:00:00")');
    }));


    it('should set start date to today', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const button = domQuery('.use-today', simpleDateEdit);

      // when
      triggerClick(button);

      // then
      expect(inputEntry1.businessObject.text).to
        .equal(`date and time("${ getSampleDate() }")`);
    }));


    it('should edit end date', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleDateEdit('inputEntry7');

      const input = domQuery.all('.dms-input', simpleDateEdit)[1];

      // when
      triggerInputEvent(input, '2000-01-01T00:00:00');

      // then
      expect(inputEntry7.businessObject.text).to

        // eslint-disable-next-line
        .equal('[date and time("2018-01-25T00:00:00")..date and time("2000-01-01T00:00:00")]');
    }));


    it('should validate end date', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleDateEdit('inputEntry7');

      const input = domQuery.all('.dms-input', simpleDateEdit)[1];

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(inputEntry7.businessObject.text).to

        // eslint-disable-next-line
        .equal('[date and time("2018-01-25T00:00:00")..date and time("2018-01-25T23:59:59")]');
    }));


    it('should set end date to today', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleDateEdit('inputEntry7');

      const button = domQuery.all('.use-today', simpleDateEdit)[1];

      // when
      triggerClick(button);

      // then
      expect(inputEntry7.businessObject.text).to

        // eslint-disable-next-line
        .equal(`[date and time("2018-01-25T00:00:00")..date and time("${ getSampleDate() }")]`);
    }));


    describe('empty', function() {

      it('should only set once valid', inject(function(elementRegistry) {

        // given
        const inputEntry8 = elementRegistry.get('inputEntry8');

        const simpleDateEdit = openSimpleDateEdit('inputEntry8');

        const select = domQuery('.dms-select', simpleDateEdit);

        // when
        triggerChangeEvent(select, 'between');

        // then
        // expect not to have been set yet
        expect(inputEntry8.businessObject.text).to.equal('');

        // when
        const buttons = domQuery.all('.use-today', simpleDateEdit);

        triggerClick(buttons[0]);

        // expect not to have been set yet
        expect(inputEntry8.businessObject.text).to.equal('');

        // when
        triggerClick(buttons[1]);

        // expect not to have been set yet
        expect(inputEntry8.businessObject.text).to

          // eslint-disable-next-line
          .equal(`[date and time("${ getSampleDate() }")..date and time("${ getSampleDate() }")]`);
      }));

    });

  });


  describe('OutputClause', function() {

    it('should render', function() {

      // when
      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      // then
      expect(simpleDateEdit).to.exist;
    });


    it('should edit date', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '2000-01-01T00:00:00');

      // then
      expect(outputEntry1.businessObject.text).to
        .equal('date and time("2000-01-01T00:00:00")');
    }));


    it('should validate date', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(outputEntry1.businessObject.text).to
        .equal('date and time("2018-01-25T00:00:00")');
    }));


    it('should set date to today', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      const button = domQuery('.use-today', simpleDateEdit);

      // when
      triggerClick(button);

      // then
      expect(outputEntry1.businessObject.text).to
        .equal(`date and time("${ getSampleDate() }")`);
    }));

  });

});