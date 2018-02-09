
// eslint-disable-next-line
import Inferno from 'inferno';

import { bootstrapModeler, inject } from 'test/helper';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';

import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

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
    const cell = queryEditor('[data-element-id="inputEntry1"]', testContainer);

    cell.focus();

    // when
    triggerInputEvent(cell, 'foo');

    // then
    expect(elementRegistry.get('inputEntry1').businessObject.text).to.equal('foo');
  }));


  it('should edit cell - line breaks', inject(function(elementRegistry) {

    // given
    const cell = queryEditor('[data-element-id="inputEntry1"]', testContainer);

    cell.focus();

    // when
    triggerInputEvent(cell, 'foo\nbar');

    cell.blur();

    // then
    expect(elementRegistry.get('inputEntry1').businessObject.text).to.equal('foo\nbar');

    expect(cell.innerHTML).to.equal('foo\nbar');
  }));

});