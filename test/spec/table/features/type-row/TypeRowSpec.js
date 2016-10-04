'use strict';

require('../../TestHelper');

var EventUtils = require('../../util/EventUtils'),
    inputEvent = EventUtils.inputEvent,
    queryElement = require('../../util/ElementUtils').queryElement,
    clickElement = EventUtils.clickElement;

/* global bootstrapModeler, inject */

var basicXML = require('../../../../fixtures/dmn/simple.dmn');

describe('features/type-row', function() {

  var modeler;

  beforeEach(function(done) {
    modeler = bootstrapModeler(basicXML)(done);
  });

  describe('input', function() {
    it('should persist added allowed values in the xml', inject(function(typeRow, elementRegistry) {

      var element = elementRegistry.get('cell_input1_typeRow');

      typeRow.addAllowedValue(element, 'myValue');

      modeler.saveXML(function(err, xml) {
        expect(xml).to.contain('myValue');
      });

    }));

    it('should apply a transient change when closing the popover', inject(function(elementRegistry, sheet) {
      // given
      var cell = elementRegistry.get('cell_input1_typeRow');

      // when
      clickElement(cell);

      var editor = queryElement('.dmn-clausevalues-setter');

      inputEvent(queryElement('.allowed-values input', editor), 'first value, second value');

      clickElement(sheet.getContainer());

      // then
      modeler.saveXML(function(err, xml) {
        expect(xml).to.contain('first value');
        expect(xml).to.contain('second value');
      });
    }));
  });

  describe('output', function() {
    it('should persist added allowed values in the xml', inject(function(typeRow, elementRegistry) {

      var element = elementRegistry.get('cell_output1_typeRow');

      typeRow.addAllowedValue(element, 'myValue');

      modeler.saveXML(function(err, xml) {
        expect(xml).to.contain('myValue');
      });

    }));
  });


});
