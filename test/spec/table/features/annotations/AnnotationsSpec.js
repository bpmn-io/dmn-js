'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var basicXML = require('../../../../fixtures/dmn/new-table.dmn');

describe('features/annotations', function() {

  var modeler;

  beforeEach(function(done) {
    modeler = bootstrapModeler(basicXML)(done);
  });

  beforeEach(inject(function(modeling) {
    modeling.createRow({ id: 'row' });
  }));

  it('should persist annotations in the xml', inject(function(annotations, elementRegistry, modeling) {

    modeling.editCell('row', annotations.getColumn().id, 'This is an annotation');

    modeler.saveXML(function(err, xml) {
      expect(xml).to.contain('This is an annotation');
    });

  }));

});
