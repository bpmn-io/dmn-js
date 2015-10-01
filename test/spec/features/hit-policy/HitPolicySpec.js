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

});
