'use strict';

var TestHelper = require('../../TestHelper');

/* global bootstrapModeler, inject */

var EventUtils = require('../../util/EventUtils'),
    queryElement = require('../../util/ElementUtils').queryElement,
    clickElement = EventUtils.clickElement,
    clickAndQuery = EventUtils.clickAndQuery;

var inputVariableXML = require('../../../../fixtures/dmn/input-variable.dmn');

var INPUT_VAR_EXPR = '.dmn-clauseexpression-setter .expression input[placeholder="cellInput"]',
    INPUT_VAR_SCRIPT = '.dmn-clauseexpression-setter .script input[placeholder="cellInput"]';


describe('features/mappings-row', function() {

  describe('inputVariable', function() {

    var modeler;

    beforeEach(bootstrapModeler(inputVariableXML, { advancedMode: true }));

    beforeEach(function() {
      modeler = TestHelper.getDmnJS();
    });

    it('should import expression', inject(function(elementRegistry, mappingsRow, eventBus) {
      // given
      var input = elementRegistry.get('input1'),
          cell = elementRegistry.get('cell_input1_mappingsRow'),
          inputVariable;

      // when
      inputVariable = clickAndQuery(cell, INPUT_VAR_EXPR);

      // then
      expect(inputVariable.value).to.equal('currentSeason');

      // when
      inputVariable = clickAndQuery(queryElement('.toggle-type a.script'), INPUT_VAR_SCRIPT);

      // then
      expect(inputVariable.value).to.equal('currentSeason');
      expect(input.businessObject.inputVariable).to.equal('currentSeason');
    }));


    it('should remove on close', inject(function(elementRegistry, mappingsRow, eventBus, complexCell) {
      // given
      var input = elementRegistry.get('input1'),
          cell = elementRegistry.get('cell_input1_mappingsRow'),
          inputVariable;

      // when
      inputVariable = clickAndQuery(cell, INPUT_VAR_EXPR);

      inputVariable.value = '';

      // when
      complexCell.close();

      inputVariable = clickAndQuery(cell, INPUT_VAR_EXPR);

      // then
      expect(inputVariable.value).to.equal('');
      expect(input.businessObject.inputVariable).to.equal('');
    }));


    it('should synchronize after changing modes', inject(function(elementRegistry, mappingsRow, eventBus, complexCell) {
      // given
      var cell = elementRegistry.get('cell_input1_mappingsRow'),
          cellGfx = elementRegistry.getGraphics(cell),
          inputVariable;

      clickElement(cellGfx);

      inputVariable = queryElement(INPUT_VAR_EXPR);

      inputVariable.value = 'foobar';

      // when
      inputVariable = clickAndQuery(queryElement('.toggle-type a.script'), INPUT_VAR_SCRIPT);

      // then
      expect(inputVariable.value).to.equal('foobar');
    }));


    it('should persist editing changes .script', inject(function(elementRegistry, mappingsRow, eventBus, complexCell) {
      // given
      var input = elementRegistry.get('input1'),
          cell = elementRegistry.get('cell_input1_mappingsRow'),
          cellGfx = elementRegistry.getGraphics(cell),
          inputVariable;

      clickElement(cellGfx);

      inputVariable = clickAndQuery(queryElement('.toggle-type a.script'), INPUT_VAR_SCRIPT);

      inputVariable.value = 'foobar';

      // when
      complexCell.close();

      // then
      modeler.saveXML(function(err, xml) {
        expect(input.businessObject.inputVariable).to.equal('foobar');

        expect(xml).to.include('camunda:inputVariable="foobar"');
      });
    }));


    it('should persist editing changes .expression', inject(function(elementRegistry, mappingsRow, eventBus, complexCell) {
      // given
      var input = elementRegistry.get('input1'),
          cell = elementRegistry.get('cell_input1_mappingsRow'),
          cellGfx = elementRegistry.getGraphics(cell);

      var inputVariable = clickAndQuery(cellGfx, INPUT_VAR_EXPR);

      inputVariable.value = 'foobar';

      // when
      complexCell.close();

      // then
      modeler.saveXML(function(err, xml) {
        expect(input.businessObject.inputVariable).to.equal('foobar');

        expect(xml).to.include('camunda:inputVariable="foobar"');
      });
    }));

  });

});
