'use strict';

var TestHelper = require('../../../TestHelper');

var domClasses = require('min-dom/lib/classes');

/* global bootstrapModeler, inject */


describe('features/column-drag', function() {

  describe('visuals', function() {

    beforeEach(bootstrapModeler());

    it('creates a drag visual for an empty table', inject(function(columnDrag) {
      expect(columnDrag.createDragVisual('cell_input1_decisionTable')).to.be.defined;
    }));

  });

});
