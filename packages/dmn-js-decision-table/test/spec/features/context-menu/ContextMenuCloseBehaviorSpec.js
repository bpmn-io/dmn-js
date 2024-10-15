import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import ContextMenuModule from 'src/features/context-menu';
import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesModule from 'src/features/decision-rules';


describe('context menu close behavior', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      ContextMenuModule,
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should close on commandstack.executed', inject(function(eventBus) {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    triggerMouseEvent(cell, 'contextmenu');

    // when
    eventBus.fire('commandStack.executed', {
      command: 'row.add'
    });

    // then
    expect(domQuery('.context-menu', testContainer)).to.not.exist;
  }));


  it('should NOT close on commandstack.executed', inject(function(eventBus) {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    triggerMouseEvent(cell, 'contextmenu');

    // when
    eventBus.fire('commandStack.executed', {
      command: 'foo'
    });

    // then
    expect(domQuery('.context-menu', testContainer)).to.exist;
  }));


  it('should close on commandstack.reverted', inject(function(eventBus) {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    triggerMouseEvent(cell, 'contextmenu');

    // when
    eventBus.fire('commandStack.reverted');

    // then
    expect(domQuery('.context-menu', testContainer)).to.not.exist;
  }));

});