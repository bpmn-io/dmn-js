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

import simpleNumberEditXML from './simple-date-time-edit.dmn';

import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import SimpleDateTimeEditModule from 'src/features/simple-date-time-edit';

import { getSampleDate } from 'src/features/simple-date-time-edit/Utils';


describe('simple date time edit', function() {

  beforeEach(bootstrapModeler(simpleNumberEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule,
      SimpleDateTimeEditModule
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

      const select = domQuery('.dms-input-select', simpleDateEdit);

      // when
      triggerInputSelectChange(select, 'before', testContainer);

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('< date and time("2018-01-25T00:00:00Z")');
    }));


    it('should edit start date', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const input = domQuery('.start-date-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '2000-01-01T00:00:00Z');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('date and time("2000-01-01T00:00:00Z")');
    }));


    it('should commit invalid start date', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const input = domQuery('.start-date-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('date and time("foo")');
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

      const input = domQuery('.end-date-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '2000-01-01T00:00:00Z');

      // then
      expect(inputEntry7.businessObject.text).to

        // eslint-disable-next-line
        .equal('[date and time("2018-01-25T00:00:00Z")..date and time("2000-01-01T00:00:00Z")]');
    }));


    it('should commit invalid end date', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleDateEdit('inputEntry7');

      const input = domQuery('.end-date-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(inputEntry7.businessObject.text).to


        .equal('[date and time("2018-01-25T00:00:00Z")..date and time("foo")]');
    }));


    it('should set end date to today', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleDateEdit('inputEntry7');

      const button = domQueryAll('.use-today', simpleDateEdit)[1];

      // when
      triggerClick(button);

      // then
      expect(inputEntry7.businessObject.text).to

        // eslint-disable-next-line
        .equal(`[date and time("2018-01-25T00:00:00Z")..date and time("${ getSampleDate() }")]`);
    }));
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
      triggerInputEvent(input, '2000-01-01T00:00:00Z');

      // then
      expect(outputEntry1.businessObject.text).to
        .equal('date and time("2000-01-01T00:00:00Z")');
    }));


    it('should commit invalid date', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(outputEntry1.businessObject.text).to
        .equal('date and time("foo")');
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