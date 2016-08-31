'use strict';

require('../../../TestHelper');

/* global bootstrapModeler, inject */

var EventUtils = require('../../../util/EventUtils'),
    queryElement = require('../../../util/ElementUtils').queryElement,
    rightClickElement = EventUtils.rightClickElement,
    clickElement = EventUtils.clickElement;

var basicXML = require('../../../fixtures/dmn/simple.dmn');

describe('features/descriptions', function() {

  beforeEach(bootstrapModeler(basicXML));

  it('should add a description', inject(function(elementRegistry, eventBus) {

    var rule1 = elementRegistry.get('cell_input1_rule1'),
        contextmenu;

    // when - open context-menu
    rightClickElement(rule1);

    contextmenu = queryElement('.tjs-context-menu');

    eventBus.once('description.popover.opened', function(evt, textarea) {
      // then
      expect(textarea.tagName).to.equal('TEXTAREA');
    });

    // when
    clickElement(queryElement('[data-id="description"]', contextmenu));
  }));

});
