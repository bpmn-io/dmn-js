import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerChangeEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import simpleBooleanEditXML from './simple-boolean-edit.dmn';

import CoreModule from 'lib/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import RulesEditorModule from 'lib/features/rules/editor';
import SimpleBooleanEditModule from 'lib/features/simple-boolean-edit';


describe('simple boolean edit', function() {

  beforeEach(bootstrapModeler(simpleBooleanEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      RulesEditorModule,
      SimpleBooleanEditModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function openSimpleBooleanEdit(elementId) {
    const cell = domQuery(`[data-element-id="${ elementId }"]`, testContainer);

    triggerMouseEvent(cell, 'click');

    const button = domQuery('.simple-mode-button', testContainer);

    triggerMouseEvent(button, 'click');

    return domQuery('.simple-boolean-edit', testContainer);
  }


  describe('InputClause', function() {

    it('should render', function() {

      // when
      const simpleBooleanEdit = openSimpleBooleanEdit('inputEntry1');

      // then
      expect(simpleBooleanEdit).to.exist;
    });


    it('should edit change true to false', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleBooleanEdit = openSimpleBooleanEdit('inputEntry1');

      const select = domQuery('.select', simpleBooleanEdit);

      // when
      triggerChangeEvent(select, 'false');

      // then
      expect(inputEntry1.businessObject.text).to.equal('false');
    }));


    it('should edit change unparsable to false', inject(function(elementRegistry) {

      // given
      const inputEntry5 = elementRegistry.get('inputEntry5');

      const simpleBooleanEdit = openSimpleBooleanEdit('inputEntry5');

      const select = domQuery('.select', simpleBooleanEdit);

      // when
      triggerChangeEvent(select, 'false');

      // then
      expect(inputEntry5.businessObject.text).to.equal('false');
    }));

  });


  describe('OutputClause', function() {

    it('should render', function() {

      // when
      const simpleBooleanEdit = openSimpleBooleanEdit('outputEntry1');

      // then
      expect(simpleBooleanEdit).to.exist;
    });


    it('should edit change true to false', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleBooleanEdit = openSimpleBooleanEdit('outputEntry1');

      const select = domQuery('.select', simpleBooleanEdit);

      // when
      triggerChangeEvent(select, 'false');

      // then
      expect(outputEntry1.businessObject.text).to.equal('false');
    }));


    it('should edit change unparsable to false', inject(function(elementRegistry) {

      // given
      const outputEntry5 = elementRegistry.get('outputEntry5');

      const simpleBooleanEdit = openSimpleBooleanEdit('outputEntry5');

      const select = domQuery('.select', simpleBooleanEdit);

      // when
      triggerChangeEvent(select, 'false');

      // then
      expect(outputEntry5.businessObject.text).to.equal('false');
    }));

  });

});