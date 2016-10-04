'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var dateXML = require('../../../../fixtures/dmn/date.dmn');

var EventUtils = require('../../util/EventUtils'),
    queryElement = require('../../util/ElementUtils').queryElement,
    inputEvent = EventUtils.inputEvent,
    clickElement = EventUtils.clickElement;

describe('features/date-edit', function() {

  var cell, gfx;

  beforeEach(bootstrapModeler(dateXML));
  beforeEach(inject(function(elementRegistry) {
    cell = elementRegistry.get('cell_input1_rule1');
    gfx  = elementRegistry.getGraphics('cell_input1_rule1');
  }));

  describe('Viewer', function() {
    it('displays the normal date string in advanced mode', inject(function(simpleMode, graphicsFactory) {
      // given
      simpleMode.deactivate();
      cell.content.text = 'date and time("2016-11-11T11:11:11")';

      // when
      graphicsFactory.update('cell', cell, gfx);

      // then
      expect(gfx.textContent).to.eql('date and time("2016-11-11T11:11:11")');
    }));
    it('displays the normal date string in advanced mode', inject(function(graphicsFactory) {
      // given
      cell.content.text = 'date and time("2016-11-11T11:11:11")';

      // when
      graphicsFactory.update('cell', cell, gfx);

      // then
      expect(gfx.querySelector('.date-content').textContent).to.eql('Fri, 11 Nov 2016 11:11');
    }));
    it('displays an expression placeholder for an unparsable date', inject(function(graphicsFactory) {
      // given
      cell.content.text = 'myDateVar.dateValue';

      // when
      graphicsFactory.update('cell', cell, gfx);

      // then
      expect(gfx.querySelector('.date-content').textContent).to.eql('[expression]');
    }));
  });

  describe('Modeler', function() {
    it('creates a date expression for an exact value', inject(function(dateEdit) {
      // given

      // when
      dateEdit.updateCellContent(cell, {
        type: 'exact',
        date1: '2016-11-11T11:11:11'
      });

      // then
      expect(cell.content.text).to.eql('date and time("2016-11-11T11:11:11")');
    }));

    it('creates a date expression for a before value', inject(function(dateEdit) {
      // given

      // when
      dateEdit.updateCellContent(cell, {
        type: 'before',
        date1: '2016-11-11T11:11:11'
      });

      // then
      expect(cell.content.text).to.eql('< date and time("2016-11-11T11:11:11")');
    }));

    it('creates a date expression for an after value', inject(function(dateEdit) {
      // given

      // when
      dateEdit.updateCellContent(cell, {
        type: 'after',
        date1: '2016-11-11T11:11:11'
      });

      // then
      expect(cell.content.text).to.eql('> date and time("2016-11-11T11:11:11")');
    }));

    it('creates a date expression for a between value', inject(function(dateEdit) {
      // given

      // when
      dateEdit.updateCellContent(cell, {
        type: 'between',
        date1: '2016-11-11T11:11:11',
        date2: '2016-11-11T12:11:11'
      });

      // then
      expect(cell.content.text).to.eql('[date and time("2016-11-11T11:11:11")..date and time("2016-11-11T12:11:11")]');
    }));

    it('allows unsetting a value', inject(function(dateEdit) {
      // given
      cell.content.text = 'date and time("2016-11-11T11:11:11")';

      // when
      dateEdit.updateCellContent(cell, {
        type: 'disjunction',
        date1: ''
      });

      // then
      expect(cell.content.text).to.eql('');
    }));

    describe('Interaction', function() {
      it('opens the editor popup when clicking on a date cell in simple mode', inject(function() {
        // given

        // when
        clickElement(queryElement('[data-element-id="cell_input1_rule1"]'));

        // then
        expect(queryElement('.dmn-date-editor')).to.exist;
      }));

      it('sets a date expression', inject(function(elementRegistry, sheet) {
        // given
        var rule = elementRegistry.get('cell_input1_rule2');

        // when
        clickElement(rule);

        var editor = queryElement('.dmn-date-editor');

        inputEvent(queryElement('.date-1 input', editor), '2020-04-18T17:23:41');

        clickElement(sheet.getContainer());

        // then
        expect(rule.content.text).to.equal('date and time("2020-04-18T17:23:41")');
      }));
    });
  });
});
