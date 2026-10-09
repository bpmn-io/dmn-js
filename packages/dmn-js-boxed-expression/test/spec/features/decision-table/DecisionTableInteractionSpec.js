import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import {
  triggerKeyEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

import decisionXML from '../../simple.dmn';


describe('features/decision-table - interaction', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(decisionXML));


  it('should open single context menu on cell context menu', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerMouseEvent(cell, 'contextmenu');

    // then
    expect(domQueryAll('.context-menu', testContainer)).to.have.length(1);
  });


  it('should open context menu inside of boxed expression container', function() {

    // given
    const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

    // when
    triggerMouseEvent(cell, 'contextmenu');

    // then
    expect(domQuery('.dmn-boxed-expression-container .context-menu', testContainer))
      .to.exist;
  });


  it('should NOT add rule on <ENTER> in decision name', inject(function(sheet) {

    // given
    const name = domQuery('.dmn-boxed-expression-header [contenteditable]', testContainer);

    const rowCount = sheet.getRoot().rows.length;

    // when
    triggerKeyEvent(name, 'keydown', 13);

    // then
    expect(sheet.getRoot().rows).to.have.length(rowCount);
  }));

});
