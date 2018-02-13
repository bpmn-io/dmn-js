import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerChangeEvent,
  triggerInputEvent,
  triggerKeyEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import simpleStringEditXML from './simple-string-edit.dmn';

import CoreModule from 'lib/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'lib/features/modeling';
import RulesEditorModule from 'lib/features/rules/editor';
import SimpleStringEditModule from 'lib/features/simple-string-edit';


describe('simple string edit', function() {

  beforeEach(bootstrapModeler(simpleStringEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      RulesEditorModule,
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
      const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

      triggerMouseEvent(cell, 'click');

      const button = domQuery('.simple-mode-button', testContainer);

      triggerMouseEvent(button, 'click');

      simpleStringEdit = domQuery('.simple-string-edit', testContainer);

      inputEntry1 = elementRegistry.get('inputEntry1');
    }));


    it('should render', function() {

      // then
      expect(simpleStringEdit).to.exist;
    });


    it('should change type of unary tests', function() {

      // given
      const select = domQuery('.select', simpleStringEdit);

      // when
      triggerChangeEvent(select, 'negation');

      // then
      expect(inputEntry1.businessObject.text).to.equal('not("bronze")');
    });


    it('should select value from list of predefined', function() {

      // given
      const checkbox = domQuery.all('input[type="checkbox"]', simpleStringEdit)[1];

      // when
      triggerMouseEvent(checkbox, 'click');

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

      triggerMouseEvent(remove, 'mouseup');

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

  });


  describe('OutputClause', function() {

    let simpleStringEdit,
        outputEntry1;

    beforeEach(inject(function(elementRegistry) {
      const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

      triggerMouseEvent(cell, 'click');

      const button = domQuery('.simple-mode-button', testContainer);

      triggerMouseEvent(button, 'click');

      simpleStringEdit = domQuery('.simple-string-edit', testContainer);

      outputEntry1 = elementRegistry.get('outputEntry1');
    }));


    it('should render', function() {

      // then
      expect(simpleStringEdit).to.exist;
    });


    it('should select value from list of predefined', function() {

      // given
      const radio = domQuery.all('input[type="radio"]', simpleStringEdit)[0];

      // when
      triggerMouseEvent(radio, 'click');

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