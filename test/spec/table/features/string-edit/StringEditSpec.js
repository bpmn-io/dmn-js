'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var stringXML = require('../../../../fixtures/dmn/simple.dmn');

var EventUtils = require('../../util/EventUtils'),
    queryElement = require('../../util/ElementUtils').queryElement,
    inputEvent = EventUtils.inputEvent,
    clickElement = EventUtils.clickElement;

describe('features/string-edit', function() {

  var cell, gfx;

  beforeEach(bootstrapModeler(stringXML));
  beforeEach(inject(function(elementRegistry) {
    cell = elementRegistry.get('cell_input1_rule1');
    gfx  = elementRegistry.getGraphics('cell_input1_rule1');
  }));

  describe('Viewer', function() {
    it('displays the string in advanced mode', inject(function(simpleMode, graphicsFactory) {
      // given
      simpleMode.deactivate();
      cell.content.text = '"string", expression';

      // when
      graphicsFactory.update('cell', cell, gfx);

      // then
      expect(gfx.textContent).to.eql('"string", expression');
    }));
    it('displays the string in simple mode if it is parsable', inject(function(graphicsFactory) {
      // given
      cell.content.text = '"string", "another string"';

      // when
      graphicsFactory.update('cell', cell, gfx);

      // then
      expect(gfx.querySelector('.string-content').textContent).to.eql('"string", "another string"');
    }));
    it('displays an expression placeholder for an unparsable string', inject(function(graphicsFactory) {
      // given
      cell.content.text = 'stringVarable';

      // when
      graphicsFactory.update('cell', cell, gfx);

      // then
      expect(gfx.querySelector('.string-content').textContent).to.eql('[expression]');
    }));
  });

  describe('Modeler', function() {
    it('sets the string expression for a single value', inject(function(stringEdit) {
      // given

      // when
      stringEdit.setCellContent({
        type: 'disjunction',
        values: ['value']
      }, cell);

      // then
      expect(cell.content.text).to.eql('"value"');
    }));

    it('sets the string expression for a disjunction', inject(function(stringEdit) {
      // given

      // when
      stringEdit.setCellContent({
        type: 'disjunction',
        values: ['value', 'anotherValue']
      }, cell);

      // then
      expect(cell.content.text).to.eql('"value", "anotherValue"');
    }));

    it('sets the string expression for a single negated value', inject(function(stringEdit) {
      // given

      // when
      stringEdit.setCellContent({
        type: 'negation',
        values: ['value']
      }, cell);

      // then
      expect(cell.content.text).to.eql('not("value")');
    }));

    it('sets the string expression for a negation of multiple values', inject(function(stringEdit) {
      // given

      // when
      stringEdit.setCellContent({
        type: 'negation',
        values: ['value', 'anotherValue']
      }, cell);

      // then
      expect(cell.content.text).to.eql('not("value", "anotherValue")');
    }));

    it('allows unsetting a value', inject(function(stringEdit) {
      // given
      cell.content.text = '"value", "anotherValue"';

      // when
      stringEdit.setCellContent({
        type: '',
        values: []
      }, cell);

      // then
      expect(cell.content.text).to.eql('');
    }));

    describe('Interaction', function() {
      it('opens the editor popup when clicking on a string cell in simple mode', inject(function() {
        // given

        // when
        clickElement(queryElement('[data-element-id="cell_input1_rule1"]'));

        // then
        expect(queryElement('.dmn-string-editor')).to.exist;
      }));
      it('has input values checkboxes when input values are set', inject(function(stringEdit) {
        // given
        cell.column.businessObject.inputValues = { text: '"bronze","silver","gold"' };
        stringEdit.refresh();

        // when
        clickElement(queryElement('[data-element-id="cell_input1_rule1"]'));

        // then
        expect(queryElement('.dmn-string-editor .input-values input[type="checkbox"]')).to.exist;

      }));

      it('remove a value (roundtrip)', inject(function(elementRegistry, sheet) {
        // given
        var cell = elementRegistry.get('cell_input1_rule1');

        // when
        clickElement(cell);

        var stringEditor = queryElement('.dmn-string-editor');

        clickElement(queryElement('.dmn-icon-clear', stringEditor));

        clickElement(sheet.getContainer());

        // then
        expect(cell.content.text).to.equal('');
      }));

      it('adds a transient value on dialog close', inject(function(elementRegistry, sheet) {
        // given
        var cell = elementRegistry.get('cell_input1_rule1');

        // when
        clickElement(cell);

        var stringEditor = queryElement('.dmn-string-editor');

        var input = queryElement('.free-input input', stringEditor);

        inputEvent(input, 'newValue');

        clickElement(sheet.getContainer());

        // then
        expect(cell.content.text).to.contain('"newValue"');
      }));

      it('does not add the same value twice', inject(function(elementRegistry, sheet) {
        // given
        var cell = elementRegistry.get('cell_input1_rule1');

        // when
        clickElement(cell);

        var stringEditor = queryElement('.dmn-string-editor');

        var input = queryElement('.free-input input', stringEditor);

        inputEvent(input, 'bronze, bronze');

        clickElement(sheet.getContainer());

        // then
        expect(cell.content.text).to.eql('"bronze"');
      }));
    });
  });
});
