'use strict';

var TestHelper = require('../../../TestHelper');

var domClasses = require('min-dom/lib/classes');

/* global bootstrapModeler, inject */


describe('features/hide-tech-control', function() {

  describe('api', function() {

    beforeEach(bootstrapModeler());

    it('should display a button to hide the controls', inject(function(hideTechControl) {
      expect(hideTechControl._node).to.be.defined;
    }));

    it('should apply class when details are hidden', inject(function(hideTechControl, sheet) {
      hideTechControl.hide();

      expect(domClasses(sheet.getContainer().parentNode).list.contains('hide-mappings')).to.eql(true);
    }));

    it('should remove class when details are shown', inject(function(hideTechControl, sheet) {
      hideTechControl.show();

      expect(domClasses(sheet.getContainer().parentNode).list.contains('hide-mappings')).to.eql(false);
    }));

  });

  describe('defaults', function() {

    beforeEach(bootstrapModeler({hideDetails: true}));

    it('should hide the controls per default if set in the configuration', inject(function(sheet) {
      expect(domClasses(sheet.getContainer().parentNode).list.contains('hide-mappings')).to.eql(true);
    }));

  });


});
