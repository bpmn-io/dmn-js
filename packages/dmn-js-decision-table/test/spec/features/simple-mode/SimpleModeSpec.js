import { bootstrapModeler } from 'test/TestHelper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerClick } from 'dmn-js-shared/test/util/EventUtil';

import simpleStringEditXML from './simple-mode.dmn';

import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';
import DecisionTablePropertiesEditorModule
  from 'src/features/decision-table-properties/editor';
import DecisionRuleIndicesModule from 'src/features/decision-rule-indices';
import SimpleModeModule from 'src/features/simple-mode';

import FooProvider from './FooProvider';


describe('simple mode', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(simpleStringEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule,
      DecisionTablePropertiesEditorModule,
      DecisionRuleIndicesModule,
      SimpleModeModule,
      {
        __init__: [ 'fooProvider' ],
        fooProvider: [ 'type', FooProvider ]
      }
    ]
  }));


  it('should render - enabled', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerClick(cell);

    // then
    expect(domQuery('.simple-mode-button', testContainer)).to.exist;
  });


  it('should render - disabled', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry3"]', testContainer);

    // when
    triggerClick(cell);

    // then
    expect(domQuery('.simple-mode-button.disabled', testContainer)).to.exist;
  });


  it('should render on cell selection change', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerClick(cell);

    // then
    expect(domQuery('.simple-mode-button', testContainer)).to.exist;

    triggerClick(domQuery('.simple-mode-button', testContainer));

    // when
    triggerClick(cell);

    // then
    expect(domQuery('.simple-mode-button', testContainer)).to.exist;
  });


  it('should render at top right corner', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerClick(cell);

    // then
    const cellBounds = cell.getBoundingClientRect();

    const simpleModeButton = domQuery('.simple-mode-button', testContainer),
          simpleModeButtonBounds = simpleModeButton.getBoundingClientRect();

    expect(simpleModeButton.classList.contains('right')).to.be.true;
    expect(simpleModeButton.classList.contains('bottom')).to.be.true;
    expect(simpleModeButtonBounds.left + 4).to.be.closeTo(cellBounds.right, 1);
    expect(simpleModeButtonBounds.bottom - 4).to.be.closeTo(cellBounds.top, 1);
  });


  it('should open context menu if default expression language', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    triggerClick(cell);

    const button = domQuery('.simple-mode-button', testContainer);

    // when
    triggerClick(button);

    // then
    expect(domQuery('.foo', testContainer)).to.exist;
  });


  it('should not open context menu if not default expression language', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry3"]', testContainer);

    triggerClick(cell);

    const button = domQuery('.simple-mode-button', testContainer);

    // when
    triggerClick(button);

    // then
    expect(domQuery('.foo', testContainer)).to.not.exist;
  });


  it('should open simple edit immediately on click + CMD', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerClick(cell, 0, 0, true);

    // then
    expect(domQuery('.foo', testContainer)).to.exist;
  });


  it('should hide and show debounced when scrolling container', function(done) {

    // given
    const tableContainer = domQuery('.tjs-table-container', testContainer);

    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    triggerClick(cell, 0, 0);

    // when
    tableContainer.dispatchEvent(new Event('scroll'));

    // then
    expect(domQuery('.simple-mode-button', testContainer)).not.to.exist;

    setTimeout(() => {

      // but then
      expect(domQuery('.simple-mode-button', testContainer)).to.exist;

      done();
    }, 300);
  });

});