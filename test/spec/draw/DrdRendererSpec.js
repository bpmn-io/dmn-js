
require('../../TestHelper');

/* global bootstrapViewer */


describe('draw - DrdRenderer', function() {

  it('Knowledge Source', function(done) {
    var xml = require('../../fixtures/dmn/knowledge-source.dmn');

    bootstrapViewer(xml)(done);
  });

  it('Business Knowledge Model', function(done) {
    var xml = require('../../fixtures/dmn/business-knowledge.dmn');

    bootstrapViewer(xml)(done);
  });

  it('Input Data', function(done) {
    var xml = require('../../fixtures/dmn/input-data.dmn');

    bootstrapViewer(xml)(done);
  });

});
