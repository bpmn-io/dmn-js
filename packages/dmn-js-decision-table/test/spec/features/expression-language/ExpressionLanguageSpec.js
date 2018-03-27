import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerInputEvent,
  triggerInputSelectChange,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import ContextMenuModule from 'lib/features/context-menu';
import CoreModule from 'lib/core';
import ExpressionLanguageModule from 'lib/features/expression-language';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'lib/features/modeling';
import DecisionRulesEditorModule from 'lib/features/decision-rules/editor';
import KeyboardModule from 'lib/features/keyboard';


describe('expression language', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      ContextMenuModule,
      CoreModule,
      ExpressionLanguageModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule,
      KeyboardModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function openContextMenu(elementId, elementRegistry) {
    const cell = domQuery(`[data-element-id="${ elementId }"]`, testContainer);

    triggerMouseEvent(cell, 'contextmenu');

    return domQuery('.expression-language', testContainer);
  }


  it('should edit expression language - input', inject(function(elementRegistry) {

    // given
    const inputSelect = openContextMenu('inputEntry1');

    const input = domQuery('.dms-input', inputSelect);

    // when
    triggerInputEvent(input, 'foo');

    // then
    const expressionLanguage =
      elementRegistry.get('inputEntry1').businessObject.expressionLanguage;

    expect(expressionLanguage).to.equal('foo');
  }));


  it('should edit expression language - select', inject(function(elementRegistry) {

    // given
    const inputSelect = openContextMenu('inputEntry1');

    // when
    triggerInputSelectChange(inputSelect, 'javascript', testContainer);

    // then
    const expressionLanguage =
      elementRegistry.get('inputEntry1').businessObject.expressionLanguage;

    expect(expressionLanguage).to.equal('javascript');
  }));

});