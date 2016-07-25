'use strict';

var TestHelper = require('../../../TestHelper');

var domClasses = require('min-dom/lib/classes');

/* global bootstrapModeler, inject */


describe('features/simple-editing', function() {

  beforeEach(bootstrapModeler());

  it('should not put quotes when editing table head', inject(function(modeling, elementRegistry) {

    // when
    modeling.editCell('decisionTable', 'input1', 'columnLabel');

    // then
    expect(elementRegistry.getGraphics('cell_input1_decisionTable').textContent).to.eql('columnLabel');
  }));

});
