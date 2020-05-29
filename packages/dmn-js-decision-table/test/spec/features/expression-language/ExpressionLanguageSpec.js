import { bootstrapModeler, getDecisionTable, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerInputEvent,
  triggerInputSelectChange
} from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import ContextMenuModule from 'src/features/context-menu';
import CoreModule from 'src/core';
import ExpressionLanguageModule from 'src/features/expression-language';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import KeyboardModule from 'src/features/keyboard';


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

  function openContextMenu(elementId) {
    getDecisionTable().invoke(function(contextMenu) {
      contextMenu.open({
        x: 0,
        y: 0
      }, {
        contextMenuType: 'expression-language',
        id: elementId
      });
    });

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