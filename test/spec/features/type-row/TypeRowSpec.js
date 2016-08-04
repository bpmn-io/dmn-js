'use strict';

require('../../../TestHelper');

/* global bootstrapModeler, inject */

var basicXML = require('../../../fixtures/dmn/simple.dmn');

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
