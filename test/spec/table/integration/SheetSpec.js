'use strict';

require('../TestHelper');

/* global bootstrapModeler, inject */

var largeXML = require('../../../fixtures/dmn/large.dmn'),
    basicXML = require('../../../fixtures/dmn/new-table.dmn');

describe('integration/sheet', function() {

  describe('large table', function() {

    beforeEach(bootstrapModeler(largeXML, { minColWidth: 200 }));

    it(' should resize when sheet width is lower than the min column width',
      inject(function(eventBus, elementRegistry, sheet) {
      // given
        var container = sheet.getContainer(),
            initialWidth = container.clientWidth;

      // when
        eventBus.fire('sheet.resized');

      // then
        expect(container.clientWidth).to.not.equal(initialWidth);
      }));

  });

  describe('small table', function() {

    beforeEach(function(done) {
      bootstrapModeler(basicXML, { minColWidth: 200 })(done);
    });

    // tests fail in PhantomJS
    it.skip('should NOT resize when sheet width is higher than the min column width',
      inject(function(eventBus, elementRegistry, sheet) {

        // given
        var container = sheet.getContainer(),
            initialWidth = container.clientWidth;

        // when
        eventBus.fire('sheet.resized');

        // then
        expect(container.clientWidth).to.equal(initialWidth);
      }));


    it.skip('should resize when adding columns that increase the sheet width',
      inject(function(sheet, editorActions) {

        // given
        var container = sheet.getContainer(),
            initialWidth = container.clientWidth;

        // when
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');

        // then
        expect(container.clientWidth).to.not.equal(initialWidth);
      }));


    it.skip('should reset width when removing columns that increased the sheet width',
      inject(function(elementRegistry, sheet, editorActions, selection) {

        // given
        var container = sheet.getContainer(),
            initialWidth = container.clientWidth,
            utilityColumn,
            cell;

        // when
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');
        editorActions.trigger('clauseAdd', 'input');

        utilityColumn = elementRegistry.filter(function(elem) {
          return elem.id === 'utilityColumn';
        })[0];

        cell = elementRegistry.filter(function(elem) {
          return elem.column && elem.column.id === utilityColumn.next.next.id;
        })[0];

        selection.select(cell);

        editorActions.trigger('clauseRemove');

        // then
        expect(container.clientWidth).to.equal(initialWidth);
      }));

  });

});
