'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var EventUtils = require('../../util/EventUtils'),
    queryElement = require('../../util/ElementUtils').queryElement,
    rightClickElement = EventUtils.rightClickElement,
    clickElement = EventUtils.clickElement;

var basicXML = require('../../../../fixtures/dmn/simple.dmn');

describe('features/context-menu', function() {

  beforeEach(bootstrapModeler(basicXML));

  it('should open the context-menu and add a rule', inject(function(elementRegistry) {

    var rule1 = elementRegistry.get('cell_input1_rule1'),
        rule4 = elementRegistry.get('cell_input1_rule4'),
        contextmenu;

    // when - open context-menu
    rightClickElement(rule1);

    contextmenu = queryElement('.tjs-context-menu');

    // then
    expect(rule4.row.next).to.not.exist;

    // when
    clickElement(queryElement('[data-id="ruleAdd"]', contextmenu));

    // then
    expect(rule4.row.next).to.exist;
  }));

});
