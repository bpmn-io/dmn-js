'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */


var basicXML = require('../../../../fixtures/dmn/new-table.dmn');

describe('features/factory', function() {

  beforeEach(function(done) {
    bootstrapModeler(basicXML)(done);
  });


  it('should automatically create an id for a created rule', inject(function(tableFactory) {
    var rule = tableFactory.createRule();

    expect(rule.id).to.be.defined;
  }));


  it('should use a provided id for a created rule', inject(function(tableFactory) {
    var rule = tableFactory.createRule('newRule');

    expect(rule.id).to.eql('newRule');
  }));


  it('should set up inputExpression $parent when creating a clause', inject(function(tableFactory) {
    var clause = tableFactory.createInputClause('new-clause');

    expect(clause.inputExpression.$parent).to.eql(clause);
  }));

});
