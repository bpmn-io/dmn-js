'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var basicXML = require('../../../../fixtures/dmn/new-table.dmn');


describe('features/simple-editing', function() {

  beforeEach(bootstrapModeler(basicXML));

  // fails with Chrome and not with PhantomJS
  it.skip('should not put quotes when editing table head', inject(function(modeling, elementRegistry) {

    // when
    modeling.editCell('decisionTable', 'input1', 'columnLabel');

    // then
    expect(elementRegistry.getGraphics('cell_input1_decisionTable').textContent).to.eql('columnLabel');
  }));

});
