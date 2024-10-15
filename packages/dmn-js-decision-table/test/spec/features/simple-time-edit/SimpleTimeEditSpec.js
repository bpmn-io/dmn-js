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

import simpleNumberEditXML from './simple-time-edit.dmn';

import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import SimpleTimeEditModule from 'src/features/simple-time-edit';

import { getSampleTime } from 'src/features/simple-time-edit/Utils';


describe('simple time edit', function() {

  beforeEach(bootstrapModeler(simpleNumberEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule,
      SimpleTimeEditModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function openSimpleTimeEdit(elementId) {
    const cell = domQuery(`[data-element-id="${ elementId }"]`, testContainer);

    triggerClick(cell);

    const button = domQuery('.simple-mode-button', testContainer);

    triggerClick(button);

    return domQuery('.simple-time-edit', testContainer);
  }


  describe('InputClause', function() {

    it('should render', function() {

      // when
      const simpleDateEdit = openSimpleTimeEdit('inputEntry1');

      // then
      expect(simpleDateEdit).to.exist;
    });


    it('should change type', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleTimeEdit('inputEntry1');

      const select = domQuery('.dms-input-select', simpleDateEdit);

      // when
      triggerInputSelectChange(select, 'before', testContainer);

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('< time("08:00:00Z")');
    }));


    it('should edit start time', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleTimeEdit('inputEntry1');

      const input = domQuery('.start-time-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '01:00:00Z');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('time("01:00:00Z")');
    }));


    it('should commit invalid start time', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleTimeEdit('inputEntry1');

      const input = domQuery('.start-time-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('time("foo")');
    }));


    it('should set start time to now', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleTimeEdit('inputEntry1');

      const button = domQuery('.use-now', simpleDateEdit);

      // when
      triggerClick(button);

      // then
      expect(inputEntry1.businessObject.text).to
        .equal(`time("${ getSampleTime() }")`);
    }));


    it('should edit end time', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleTimeEdit('inputEntry7');

      const input = domQuery('.end-time-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '18:00:00Z');

      // then
      expect(inputEntry7.businessObject.text).to


        .equal('[time("08:00:00Z")..time("18:00:00Z")]');
    }));


    it('should commit invalid end time', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleTimeEdit('inputEntry7');

      const input = domQuery('.end-time-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(inputEntry7.businessObject.text).to


        .equal('[time("08:00:00Z")..time("foo")]');
    }));


    it('should set end time to now', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleTimeEdit('inputEntry7');

      const button = domQueryAll('.use-now', simpleDateEdit)[1];

      // when
      triggerClick(button);

      // then
      expect(inputEntry7.businessObject.text).to


        .equal(`[time("08:00:00Z")..time("${ getSampleTime() }")]`);
    }));
  });


  describe('OutputClause', function() {

    it('should render', function() {

      // when
      const simpleTimeEdit = openSimpleTimeEdit('outputEntry1');

      // then
      expect(simpleTimeEdit).to.exist;
    });


    it('should edit time', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleTimeEdit('outputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '01:01:01Z');

      // then
      expect(outputEntry1.businessObject.text).to
        .equal('time("01:01:01Z")');
    }));


    it('should commit invalid time', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleTimeEdit('outputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(outputEntry1.businessObject.text).to
        .equal('time("foo")');
    }));


    it('should set time to now', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleTimeEdit('outputEntry1');

      const button = domQuery('.use-now', simpleDateEdit);

      // when
      triggerClick(button);

      // then
      expect(outputEntry1.businessObject.text).to
        .equal(`time("${ getSampleTime() }")`);
    }));

  });

});