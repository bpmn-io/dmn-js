'use strict';

require('../../../TestHelper');

/* global bootstrapModeler, inject */

var domQuery = require('min-dom/lib/query');

var mouseEvent = require('table-js/test/util/MouseEvents').performMouseEvent;

var inputVariableXML = require('../../../fixtures/dmn/input-variable.dmn');


describe('features/mappings-row', function() {

  describe('inputVariable', function() {

    var modeler;

    beforeEach(function(done) {
      modeler = bootstrapModeler(inputVariableXML)(done);
    });

    it('should import expression', inject(function(elementRegistry, mappingsRow, eventBus) {
      // given
      var input = elementRegistry.get('input1'),
          cell = elementRegistry.get('cell_input1_mappingsRow'),
          cellGfx = elementRegistry.getGraphics(cell),
          inputVariable;

      // when
      mouseEvent('click', cellGfx);

      inputVariable = domQuery('.dmn-clauseexpression-setter input[placeholder="inputVariable"]');

      // then
      expect(inputVariable.value).to.equal('currentSeason');

      // when
      mouseEvent('click', domQuery('.toggle-type a.script'));

      inputVariable = domQuery('.dmn-clauseexpression-setter .expression input[placeholder="inputVariable"]');

      // then
      expect(inputVariable.value).to.equal('currentSeason');
      expect(input.businessObject.inputVariable).to.equal('currentSeason');
    }));


    it('should remove on close', inject(function(elementRegistry, mappingsRow, eventBus, complexCell) {
      // given
      var input = elementRegistry.get('input1'),
          cell = elementRegistry.get('cell_input1_mappingsRow'),
          cellGfx = elementRegistry.getGraphics(cell),
          inputVariable;

      // when
      mouseEvent('click', cellGfx);

      inputVariable = domQuery('.dmn-clauseexpression-setter input[placeholder="inputVariable"]');

      inputVariable.value = '';

      // when
      complexCell.close();

      mouseEvent('click', cellGfx);

      inputVariable = domQuery('.dmn-clauseexpression-setter input[placeholder="inputVariable"]');

      // then
      expect(inputVariable.value).to.equal('');
      expect(input.businessObject.inputVariable).to.equal('');
    }));


    it('should synchronize after changing modes', inject(function(elementRegistry, mappingsRow, eventBus, complexCell) {
      // given
      var cell = elementRegistry.get('cell_input1_mappingsRow'),
          cellGfx = elementRegistry.getGraphics(cell),
          inputVariable;

      mouseEvent('click', cellGfx);

      inputVariable = domQuery('.dmn-clauseexpression-setter .expression input[placeholder="inputVariable"]');

      inputVariable.value = 'foobar';

      // when
      mouseEvent('click', domQuery('.toggle-type a.script'));

      inputVariable = domQuery('.dmn-clauseexpression-setter .script input[placeholder="inputVariable"]');

      // then
      expect(inputVariable.value).to.equal('foobar');
    }));


    it('should persist editing changes .script', inject(function(elementRegistry, mappingsRow, eventBus, complexCell) {
      // given
      var input = elementRegistry.get('input1'),
          cell = elementRegistry.get('cell_input1_mappingsRow'),
          cellGfx = elementRegistry.getGraphics(cell),
          inputVariable;

      mouseEvent('click', cellGfx);

      mouseEvent('click', domQuery('.toggle-type a.script'));

      inputVariable = domQuery('.dmn-clauseexpression-setter .script input[placeholder="inputVariable"]');

      inputVariable.value = 'foobar';

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
          cellGfx = elementRegistry.getGraphics(cell),
          inputVariable;

      mouseEvent('click', cellGfx);

      inputVariable = domQuery('.dmn-clauseexpression-setter .expression input[placeholder="inputVariable"]');

      inputVariable.value = 'foobar';

      complexCell.close();

      // then
      modeler.saveXML(function(err, xml) {
        expect(input.businessObject.inputVariable).to.equal('foobar');

        expect(xml).to.include('camunda:inputVariable="foobar"');
      });
    }));

  });

});
