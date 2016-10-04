'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var basicXML = require('../../../../fixtures/dmn/simple.dmn');

var ElementUtils = require('../../util/ElementUtils'),
    dragElement = require('../../util/EventUtils').dragElement,
    getBounds = ElementUtils.getBounds,
    queryElement = ElementUtils.queryElement;


describe('features/column-drag', function() {

  describe('visuals', function() {

    beforeEach(bootstrapModeler(basicXML));

    it('creates a drag visual for an empty table', inject(function(columnDrag) {
      expect(columnDrag.createDragVisual('cell_input1_decisionTable')).to.be.defined;
    }));


    it('should drag column to new place', inject(function(elementRegistry) {
      // given
      var input1 = elementRegistry.getGraphics('cell_input1_decisionTable'),
          input2 = elementRegistry.getGraphics('cell_input2_decisionTable'),
          dragHandle = queryElement('.drag-handle', input1),
          position = getBounds(input2);

      // when
      dragElement(dragHandle, input2, {
        clientX: position.left + position.width - (position.width / 4),
        lientY: position.top
      });

      input1 = elementRegistry.get('cell_input1_decisionTable');
      input2 = elementRegistry.get('cell_input2_decisionTable');

      // then
      expect(input1.column.previous).to.eql(input2.column);
    }));

  });

});
