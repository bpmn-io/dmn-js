'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapModeler, inject */


describe('features/hit-policy', function() {

  beforeEach(bootstrapModeler());

  it('should return the default hitPolicy UNIQUE for a new table', inject(function(hitPolicy) {
    expect(hitPolicy.getHitPolicy()).to.eql('UNIQUE');
  }));

  it('should render only the first letter of the hitPolicy', inject(function(elementRegistry, hitPolicy) {
    expect(elementRegistry.getGraphics(hitPolicy.getCell()).textContent).to.eql('U');
  }));

  it('should render the aggregator for the collect policy as symbol', inject(function(elementRegistry, hitPolicy, eventBus) {
    eventBus.fire('hitPolicy.edit', {
      table: hitPolicy.table,
      hitPolicy: 'COLLECT',
      aggregation: 'MIN',
      cell: hitPolicy.getCell()
    });

    expect(elementRegistry.getGraphics(hitPolicy.getCell()).textContent).to.eql('C<');

  }));

  it('should set the rowspan to 2 when details are hidden', inject(function(hideTechControl, hitPolicy) {
    hideTechControl.hide();

    expect(hitPolicy.getCell().rowspan).to.eql(2);
  }));

});
