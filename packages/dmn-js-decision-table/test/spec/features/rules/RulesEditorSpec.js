
// eslint-disable-next-line
import Inferno from 'inferno';

import { bootstrapModeler, inject } from 'test/helper';

import { triggerInputEvent } from 'test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import RulesModule from 'lib/features/rules';
import RulesEditorModule from 'lib/features/rules/editor';

describe('rules editor', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      RulesModule,
      RulesEditorModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should edit cell', inject(function(elementRegistry) {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    cell.focus();

    // when
    triggerInputEvent(cell, 'foo');

    // then
    expect(elementRegistry.get('inputEntry1').businessObject.text).to.equal('foo');
  }));

});