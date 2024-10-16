import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerMouseEvent,
  triggerKeyEvent
} from 'dmn-js-shared/test/util/EventUtil';

import { query, classes, queryAll } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import ContextMenuModule from 'src/features/context-menu';
import ContextMenuKeyboard from 'src/features/context-menu/ContextMenuKeyboard';
import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesModule from 'src/features/decision-rules';

describe('context menu keyboard', function() {

  beforeEach(bootstrapModeler(simpleXML, {

    modules: [
      ContextMenuModule,
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesModule,
      ContextMenuKeyboard
    ]
  }));

  let testContainer;
  let contextMenu;
  let entries;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
    const cell = query('[data-element-id="inputEntry1"]', testContainer);
    triggerMouseEvent(cell, 'contextmenu');

    contextMenu = query('.context-menu', testContainer);
    entries = getEntries(contextMenu);
  });


  it('should select first entry on arrow down if none focused', inject(function() {

    // when
    triggerKeyEvent(contextMenu, 'keydown', { key: 'ArrowDown' });

    // then
    expect(classes(entries[0]).has('focused')).to.be.true;
  }));


  it('should select next entry on arrow down', inject(function() {

    // given
    const currentFocused = entries[1];
    classes(currentFocused).add('focused');

    // when
    triggerKeyEvent(testContainer, 'keydown', { key: 'ArrowDown' });

    // then
    const focusedEntry = query('.context-menu-group-entry.focused', testContainer);
    expect(entries.indexOf(focusedEntry))
      .to.be.greaterThan(entries.indexOf(currentFocused));
  }));


  it('should select previous entry on arrow up', inject(function() {

    // given
    const currentFocused = entries[5];
    classes(currentFocused).add('focused');

    // when
    triggerKeyEvent(testContainer, 'keydown', { key: 'ArrowUp' });

    // then
    const focusedEntry = query('.context-menu-group-entry.focused', testContainer);
    expect(entries.indexOf(focusedEntry))
      .to.be.lessThan(entries.indexOf(currentFocused));
  }));


  it('should select first entry after last entry', inject(function() {

    // given
    const currentFocused = entries[entries.length - 1];
    classes(currentFocused).add('focused');

    // when
    triggerKeyEvent(testContainer, 'keydown', { key: 'ArrowDown' });

    // then
    const focusedEntry = query('.context-menu-group-entry.focused', testContainer);
    expect(entries.indexOf(focusedEntry))
      .to.be.lessThan(entries.indexOf(currentFocused));
  }));


  it('should skip disabled entries', inject(function() {

    // given
    classes(entries[1]).add('focused');

    // assume
    expect(classes(entries[2]).contains('disabled')).to.be.true;

    // when
    triggerKeyEvent(testContainer, 'keydown', { key: 'ArrowDown' });

    // then
    const focusedEntry = query('.context-menu-group-entry.focused', testContainer);
    expect(classes(focusedEntry).contains('disabled')).to.be.false;
  }));
});


// Helpers
function getEntries(container) {
  return Array.from(
    queryAll('.context-menu-group-entry', container)
  );
}