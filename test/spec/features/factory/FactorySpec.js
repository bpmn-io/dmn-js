'use strict';

require('../../../TestHelper');

/* global bootstrapModeler, inject */


var basicXML = require('../../../fixtures/dmn/new-table.dmn');

describe('features/factory', function() {


  beforeEach(function(done) {
    bootstrapModeler(basicXML)(done);
  });

  it('should automatically create an id for a created rule', inject(function(dmnFactory) {
    var rule = dmnFactory.createRule();

    expect(rule.id).to.be.defined;
  }));

  it('should use a provided id for a created rule', inject(function(dmnFactory) {
    var rule = dmnFactory.createRule('newRule');
    
    expect(rule.id).to.eql('newRule');
  }));

});
