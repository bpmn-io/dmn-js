import { bootstrapModeler, inject } from 'test/helper';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerInputEvent,
  triggerInputSelectChange,
  triggerKeyEvent,
  triggerMouseEvent,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import simpleStringEditXML from './simple-string-edit.dmn';

import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import SimpleStringEditModule from 'src/features/simple-string-edit';


describe('simple string edit', function() {

  beforeEach(bootstrapModeler(simpleStringEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule,
      SimpleStringEditModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('InputClause', function() {

    let simpleStringEdit,
        inputEntry1;


    beforeEach(inject(function(elementRegistry) {
      simpleStringEdit = openEditorMenu('inputEntry1', testContainer);

      inputEntry1 = elementRegistry.get('inputEntry1');
    }));


    it('should render', function() {

      // then
      expect(simpleStringEdit).to.exist;
    });


    it('should change type of unary tests', function() {

      // given
      const select = domQuery('.dms-input-select', simpleStringEdit);

      // when
      triggerInputSelectChange(select, 'negation', testContainer);

      // then
      expect(inputEntry1.businessObject.text).to.equal('not("bronze")');
    });


    it('should select value from list of predefined', function() {

      // given
      const checkbox = domQueryAll('input[type="checkbox"]', simpleStringEdit)[1];

      // when
      triggerClick(checkbox);

      // then
      expect(inputEntry1.businessObject.text).to.equal('"bronze","silver"');
    });


    it('should add custom value', function() {

      // given
      const input = domQuery('input[type="text"]', simpleStringEdit);

      // when
      input.focus();

      triggerInputEvent(input, '"foo"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expect(inputEntry1.businessObject.text).to.equal('"bronze","foo"');
    });


    it('should remove custom value', function() {

      // given
      const input = domQuery('input[type="text"]', simpleStringEdit);

      input.focus();

      triggerInputEvent(input, '"foo"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // when
      const remove = domQuery('.remove', simpleStringEdit);

      triggerMouseEvent(remove, 'click');

      // then
      expect(inputEntry1.businessObject.text).to.equal('"bronze"');
    });


    it('should not add invalid custom value', function() {

      // given
      const input = domQuery('input[type="text"]', simpleStringEdit);

      // when
      input.focus();

      triggerInputEvent(input, '"foo');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expect(inputEntry1.businessObject.text).to.equal('"bronze"');
    });


    it('should override invalid custom value', inject(function(elementRegistry) {

      // given
      const inputEntry3 = elementRegistry.get('inputEntry3');

      simpleStringEdit = openEditorMenu('inputEntry3', testContainer);

      const input = domQuery('input[type="text"]', simpleStringEdit);

      // when
      input.focus();

      triggerInputEvent(input, '"foo"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expect(inputEntry3.businessObject.text).to.equal('"foo"');
    }));


    it('should override invalid custom value (negate)', inject(function(elementRegistry) {

      // given
      const inputEntry3 = elementRegistry.get('inputEntry3');

      simpleStringEdit = openEditorMenu('inputEntry3', testContainer);

      const select = domQuery('.dms-input-select', simpleStringEdit);

      // when
      triggerInputSelectChange(select, 'negation', testContainer);

      // then
      expect(inputEntry3.businessObject.text).to.equal('not()');
    }));

  });


  describe('OutputClause', function() {

    let simpleStringEdit,
        outputEntry1;

    beforeEach(inject(function(elementRegistry) {
      simpleStringEdit = openEditorMenu('outputEntry1', testContainer);

      outputEntry1 = elementRegistry.get('outputEntry1');
    }));


    it('should render', function() {

      // then
      expect(simpleStringEdit).to.exist;
    });


    it('should select value from list of predefined', function() {

      // given
      const radio = domQueryAll('input[type="radio"]', simpleStringEdit)[0];

      // when
      triggerClick(radio);

      // then
      expect(outputEntry1.businessObject.text).to.equal('"ok"');
    });


    it('should set to custom value', function() {

      // given
      const input = domQuery('input[type="text"]', simpleStringEdit);

      // when
      input.focus();

      triggerInputEvent(input, '"foo"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expect(outputEntry1.businessObject.text).to.equal('"foo"');
    });


    it('should validate custom value', function() {

      // given
      const input = domQuery('input[type="text"]', simpleStringEdit);

      input.focus();

      triggerInputEvent(input, '"foo"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // when
      triggerInputEvent(input, '"foo');

      // then
      expect(outputEntry1.businessObject.text).to.equal('"foo"');
    });

  });

});


// helpers //////////////////////

function openEditorMenu(elementId, testContainer) {
  const cell = domQuery('[data-element-id="' + elementId + '"]', testContainer);

  triggerClick(cell);

  const button = domQuery('.simple-mode-button', testContainer);

  triggerClick(button);

  return domQuery('.simple-string-edit', testContainer);
}