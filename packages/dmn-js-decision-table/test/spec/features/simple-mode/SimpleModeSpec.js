import { bootstrapModeler } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerMouseEvent } from 'dmn-js-shared/test/util/EventUtil';

import simpleStringEditXML from './simple-mode.dmn';

import CoreModule from 'lib/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import RulesEditorModule from 'lib/features/rules/editor';
import SimpleModeModule from 'lib/features/simple-mode';

import FooProvider from './FooProvider';


describe('simple mode', function() {

  beforeEach(bootstrapModeler(simpleStringEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      RulesEditorModule,
      SimpleModeModule,
      {
        __init__: [ 'fooProvider' ],
        fooProvider: [ 'type', FooProvider ]
      }
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render - enabled', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerMouseEvent(cell, 'click');

    // then
    expect(domQuery('.simple-mode-button', testContainer)).to.exist;
  });


  it('should render - disabled', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry3"]', testContainer);

    // when
    triggerMouseEvent(cell, 'click');

    // then
    expect(domQuery('.simple-mode-button.disabled', testContainer)).to.exist;
  });


  it('should render at position', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerMouseEvent(cell, 'click');

    // then
    const simpleModeButton = domQuery('.simple-mode-button', testContainer);

    expect(simpleModeButton.style.top).to.not.equal('0px');
    expect(simpleModeButton.style.left).to.not.equal('px');
  });


  it('should open context menu if default expression language', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    triggerMouseEvent(cell, 'click');

    const button = domQuery('.simple-mode-button', testContainer);

    // when
    triggerMouseEvent(button, 'click');

    // then
    expect(domQuery('.foo', testContainer)).to.exist;
  });


  it('should not open context menu if not default expression language', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry3"]', testContainer);

    triggerMouseEvent(cell, 'click');

    const button = domQuery('.simple-mode-button', testContainer);

    // when
    triggerMouseEvent(button, 'click');

    // then
    expect(domQuery('.foo', testContainer)).to.not.exist;
  });

});