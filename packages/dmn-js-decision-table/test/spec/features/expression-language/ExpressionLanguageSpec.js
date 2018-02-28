import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerChangeEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import ContextMenuModule from 'lib/features/context-menu';
import CoreModule from 'lib/core';
import ExpressionLanguageModule from 'lib/features/expression-language';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'lib/features/modeling';
import DecisionRulesEditorModule from 'lib/features/decision-rules/editor';


describe('expression language', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      ContextMenuModule,
      CoreModule,
      ExpressionLanguageModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule
    ]
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


  it('should edit expression language', inject(function(elementRegistry) {

    // given
    const select = openContextMenu('inputEntry1');

    // when
    triggerChangeEvent(select, 'javascript');

    // then

    var expressionLanguage =
      elementRegistry.get('inputEntry1').businessObject.expressionLanguage;

    expect(expressionLanguage).to.equal('javascript');
  }));

});