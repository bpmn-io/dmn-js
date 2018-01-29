import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerChangeEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import RulesEditorModule from 'lib/features/rules/editor';
import ContextMenuModule from 'lib/features/context-menu';
import ExpressionLanguageModule from 'lib/features/expression-language';

import ModelingModule from 'lib/features/modeling';

describe('expression language', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      RulesEditorModule,
      ContextMenuModule,
      ModelingModule,
      ExpressionLanguageModule
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


  // TODO(philippfromme): fix test
  // dmn-js-decision-table modeling doesn't override table-js modeling in injector
  it('should edit expression language', inject(function(elementRegistry, injector, modeling) {

    // given
    const select = openContextMenu('inputEntry1');

    // when
    triggerChangeEvent(select, 'javascript');

    // then

  }));

});