import { bootstrapModeler } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerMouseEvent } from 'dmn-js-shared/test/util/EventUtil';

import simpleStringEditXML from '../../simple.dmn';

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


  it('should render', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerMouseEvent(cell, 'click');

    // then
    expect(domQuery('.simple-mode-button', testContainer)).to.exist;
  });


  it('should open context menu', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    triggerMouseEvent(cell, 'click');

    const button = domQuery('.simple-mode-button', testContainer);

    // when
    triggerMouseEvent(button, 'click');

    // then
    expect(domQuery('.foo', testContainer)).to.exist;
  });

});