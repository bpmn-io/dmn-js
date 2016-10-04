'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject, injectAsync */

var EventUtils = require('../../util/EventUtils'),
    queryElement = require('../../util/ElementUtils').queryElement,
    rightClickElement = EventUtils.rightClickElement,
    inputEvent = EventUtils.inputEvent,
    clickElement = EventUtils.clickElement;

var basicXML = require('../../../../fixtures/dmn/simple.dmn');

describe('features/descriptions', function() {

  beforeEach(bootstrapModeler(basicXML));

  it('should create a textarea when executing: add description', inject(function(elementRegistry, eventBus) {

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


  it('should add a description', injectAsync(function(done) {
    return function(elementRegistry, eventBus, sheet) {

      var rule1 = elementRegistry.get('cell_input1_rule1'),
          container = sheet.getContainer(),
          contextmenu, textarea;

      // when - open context-menu
      rightClickElement(rule1);

      contextmenu = queryElement('.tjs-context-menu');

      // when
      clickElement(queryElement('[data-id="description"]', contextmenu));

      textarea = queryElement('.descriptions-textarea');

      // when
      inputEvent(textarea, 'hello');

      eventBus.on('commandStack.description.edit.postExecute', function() {

        // then
        expect(rule1.content.description).to.equal('hello');

        done();
      });

      clickElement(container);
    };
  }));

});
