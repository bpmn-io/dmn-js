'use strict';

var TestHelper = require('../../../TestHelper');

var domClasses = require('min-dom/lib/classes');

/* global bootstrapModeler, inject */


describe('features/annotations', function() {

  var modeler;

  beforeEach(function(done) {
    modeler = bootstrapModeler()(done);
  });
  beforeEach(inject(function(modeling) {
    modeling.createRow({id: 'row'});
  }));

  it('should persist annotations in the xml', inject(function(annotations, elementRegistry, modeling) {

    modeling.editCell('row', annotations.getColumn().id, 'This is an annotation');

    modeler.saveXML(function(err, xml) {
      expect(xml).to.contain('This is an annotation');
    });

  }));

  it('should set the rowspan to 2 when details are hidden', inject(function(elementRegistry, hideTechControl, ioLabel, annotations) {
    hideTechControl.hide();

    // get header cell
    var cell = elementRegistry.filter(function(element) {
      return element._type === 'cell' && element.row === ioLabel.getRow() && element.column === annotations.getColumn();
    })[0];

    expect(cell.rowspan).to.eql(2);
  }));

});
