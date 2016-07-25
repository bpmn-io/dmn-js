'use strict';

var TestHelper = require('../../../TestHelper');

var domClasses = require('min-dom/lib/classes');

/* global bootstrapModeler, inject */


var basicXML = require('../../../fixtures/dmn/new-table.dmn');

describe('features/factory', function() {

  var modeler;

  beforeEach(function(done) {
    modeler = bootstrapModeler(basicXML)(done);
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
