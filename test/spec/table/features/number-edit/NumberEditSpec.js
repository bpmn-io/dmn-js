'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var EventUtils = require('../../util/EventUtils'),
    queryElement = require('../../util/ElementUtils').queryElement,
    inputEvent = EventUtils.inputEvent,
    clickAndQuery = EventUtils.clickAndQuery,
    clickElement = EventUtils.clickElement;

var basicXML = require('../../../../fixtures/dmn/simple.dmn');

describe('features/number-edit', function() {

  describe('integration', function() {

    beforeEach(bootstrapModeler(basicXML, { advancedMode: false }));

    it('should open number editor', inject(function(elementRegistry) {

      var rule1 = elementRegistry.get('cell_input2_rule1');

      // when - open
      clickElement(rule1);

      // when
      expect(queryElement('.dmn-number-editor')).to.exist;
    }));


    it('should write number', inject(function(elementRegistry, sheet) {

      var rule1 = elementRegistry.get('cell_input2_rule1'),
          container = sheet.getContainer(),
          numberEditor, input;

      // when - open
      numberEditor = clickAndQuery(rule1, '.dmn-number-editor');

      input = queryElement('.comparison-number', numberEditor);

      // when
      inputEvent(input, '1000');

      clickElement(container);

      // then
      expect(rule1.content.text).to.equal('1000');
    }));


    it('should not add anything if input is empty', inject(function(elementRegistry, sheet) {

      var rule1 = elementRegistry.get('cell_input2_rule1'),
          container = sheet.getContainer(),
          numberEditor, input;

      // when - open
      numberEditor = clickAndQuery(rule1, '.dmn-number-editor');

      input = queryElement('.comparison-number', numberEditor);

      // when
      inputEvent(input, '');

      clickElement(container);

      // then
      expect(rule1.content.text).to.equal('');
    }));


    it('should choose "less than" and write number', inject(function(elementRegistry, sheet) {

      var rule1 = elementRegistry.get('cell_input2_rule1'),
          container = sheet.getContainer(),
          numberEditor, input, dropdown;

      // when - open
      numberEditor = clickAndQuery(rule1, '.dmn-number-editor');

      input = queryElement('.comparison-number', numberEditor);

      dropdown = queryElement('.comparison-dropdown', numberEditor);

      // when - choose "less-equal"
      dropdown.selectedIndex = 2;

      // when
      inputEvent(input, '1000');

      clickElement(container);

      // then
      expect(rule1.content.text).to.equal('<= 1000');
    }));


    it('should parse existing comparison', inject(function(elementRegistry, sheet, modeling) {

      var rule1 = elementRegistry.get('cell_input2_rule1'),
          numberEditor, input, dropdown;

      // given
      modeling.editCell(rule1.row.id, rule1.column.id, '>= 1000');

      // when - open
      numberEditor = clickAndQuery(rule1, '.dmn-number-editor');

      input = queryElement('.comparison-number', numberEditor);

      dropdown = queryElement('.comparison-dropdown', numberEditor);

      // then
      expect(input.value).to.equal('1000');
      expect(dropdown.selectedIndex).to.equal(4);
    }));


    it('should switch to range', inject(function(elementRegistry, sheet) {

      var rule1 = elementRegistry.get('cell_input2_rule1'),
          container = sheet.getContainer(),
          numberEditor, rangeElement;

      // when - open
      numberEditor = clickAndQuery(rule1, '.dmn-number-editor');

      rangeElement = clickAndQuery(queryElement('.links a.range', numberEditor));

      // when - write input
      inputEvent(queryElement('input[placeholder="start"]', rangeElement), '1');
      inputEvent(queryElement('input[placeholder="end"]', rangeElement), '10');

      // include start
      clickElement(queryElement('input[placeholder="include-start"]', rangeElement));

      clickElement(container);

      // then
      expect(rule1.content.text).to.equal('[1..10[');
    }));


    it('should parse existing range', inject(function(elementRegistry, sheet, modeling) {

      var rule1 = elementRegistry.get('cell_input2_rule1'),
          numberEditor, rangeElement, start, end, includeStart, includeEnd;

      // given
      modeling.editCell(rule1.row.id, rule1.column.id, ']1..10]');

      // when - open
      numberEditor = clickAndQuery(rule1, '.dmn-number-editor');

      rangeElement = clickAndQuery(queryElement('.links a.range', numberEditor));

      start = queryElement('input[placeholder="start"]', rangeElement);
      end = queryElement('input[placeholder="end"]', rangeElement);

      includeStart = queryElement('input[placeholder="include-start"]', rangeElement);
      includeEnd = queryElement('input[placeholder="include-end"]', rangeElement);

      // then
      expect(start.value).to.equal('1');
      expect(includeStart.checked).to.equal(false);

      expect(end.value).to.equal('10');
      expect(includeEnd.checked).to.equal(true);
    }));

  });

  describe('modes', function() {

    beforeEach(bootstrapModeler(basicXML, { advancedMode: true }));

    it('should switch from advanced to simple mode and add an expression',
    inject(function(elementRegistry, editorActions, modeling) {

      var rule1 = elementRegistry.get('cell_input2_rule1'),
          ruleGfx = elementRegistry.getGraphics(rule1);

      // given
      modeling.editCell(rule1.row.id, rule1.column.id, 'foobar');

      editorActions.trigger('toggleEditingMode');

      // then
      expect(queryElement('.expression-hint', ruleGfx)).to.exist;
    }));


    it('should not open dialog when there\'s an expression', inject(function(elementRegistry, editorActions, modeling) {

      var rule1 = elementRegistry.get('cell_input2_rule1'),
          numberEditor;

      // given
      modeling.editCell(rule1.row.id, rule1.column.id, 'foobar');

      editorActions.trigger('toggleEditingMode');

      numberEditor = clickAndQuery(rule1, '.dmn-number-editor');

      // then
      expect(numberEditor).to.not.exist;
    }));

  });

  describe('methods', function() {

    beforeEach(bootstrapModeler(basicXML, { advancedMode: false }));

    it('#getEditingType', inject(function(numberEdit) {

      expect(numberEdit.getEditingType('1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('-1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('1e10')).to.equal('comparison');
      expect(numberEdit.getEditingType('> 1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('>1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('> -1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('>-1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('< 1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('<1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('= 1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('=1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('>= 1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('>=1000')).to.equal('comparison');
      expect(numberEdit.getEditingType('<1')).to.equal('comparison');
      expect(numberEdit.getEditingType('>= -e')).to.equal(null);
      expect(numberEdit.getEditingType('1000 <')).to.equal(null);
      expect(numberEdit.getEditingType('1000 < -e')).to.equal(null);
      expect(numberEdit.getEditingType('>')).to.equal(null);
      expect(numberEdit.getEditingType('1<')).to.equal(null);
      expect(numberEdit.getEditingType('-')).to.equal(null);
      expect(numberEdit.getEditingType('.')).to.equal(null);

      expect(numberEdit.getEditingType(']1..10]')).to.equal('range');
      expect(numberEdit.getEditingType(']1e10..10]')).to.equal('range');
      expect(numberEdit.getEditingType('[10..100]')).to.equal('range');
      expect(numberEdit.getEditingType('[-10..100]')).to.equal('range');
      expect(numberEdit.getEditingType('[-100..-10]')).to.equal('range');
      expect(numberEdit.getEditingType('[1.22220..102.22220]')).to.equal('range');
      expect(numberEdit.getEditingType('[-1e10..102.22220]')).to.equal('range');
      expect(numberEdit.getEditingType('[1...1]')).to.equal('range');
      expect(numberEdit.getEditingType('10..100]')).to.equal(null);
      expect(numberEdit.getEditingType('[10..100')).to.equal(null);
      expect(numberEdit.getEditingType('1]')).to.equal(null);
      expect(numberEdit.getEditingType('[]')).to.equal(null);
      expect(numberEdit.getEditingType('[-..-]')).to.equal(null);
      expect(numberEdit.getEditingType('[....]')).to.equal(null);
      expect(numberEdit.getEditingType('[e..e]')).to.equal(null);

      expect(numberEdit.getEditingType('')).to.equal('');

      expect(numberEdit.getEditingType('aaaa')).to.equal(null);
      expect(numberEdit.getEditingType('"!#!$"#')).to.equal(null);
    }));


    it('#parseRangeString', inject(function(numberEdit) {

      expect(numberEdit.parseRangeString('[1..10]')).to.eql([ '1', '10' ]);
      expect(numberEdit.parseRangeString(']1..10[')).to.eql([ '1', '10' ]);
      expect(numberEdit.parseRangeString(']12112.11111..10111111.2222]')).to.eql([ '12112.11111', '10111111.2222' ]);

      expect(numberEdit.parseRangeString('12112.11111..10111111.2222')).to.eql([ '12112.11111', '10111111.2222' ]);
    }));

  });

});
