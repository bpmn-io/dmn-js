'use strict';

require('../../TestHelper');

var booleanXML = require('../../../../fixtures/dmn/boolean.dmn'),
    basicXML = require('../../../../fixtures/dmn/new-table.dmn');

/* global bootstrapModeler, inject */


describe('features/simple-mode', function() {

  describe('api', function() {

    beforeEach(bootstrapModeler(basicXML));

    it('should display a button to enter advance mode', inject(function(simpleMode) {
      expect(simpleMode._node).to.exist;
    }));

    it('should have simple mode flag set by default', inject(function(simpleMode) {
      expect(simpleMode.isActive()).to.eql(true);
    }));

    it('should expose the current state', inject(function(simpleMode) {
      simpleMode.deactivate();
      expect(simpleMode.isActive()).to.eql(false);
      simpleMode.activate();
      expect(simpleMode.isActive()).to.eql(true);
    }));

    it('should fire an event when deactivating', inject(function(simpleMode, eventBus) {
      var functionCalled = false;
      eventBus.on('simpleMode.deactivated', function() {
        functionCalled = true;
      });

      simpleMode.deactivate();

      expect(functionCalled).to.be.true;
    }));

    it('should fire an event when activating', inject(function(simpleMode, eventBus) {
      var functionCalled = false;
      eventBus.on('simpleMode.activated', function() {
        functionCalled = true;
      });

      simpleMode.activate();

      expect(functionCalled).to.be.true;
    }));

  });

  describe('defaults', function() {

    beforeEach(bootstrapModeler(booleanXML, { advancedMode: true }));

    it('should enter advanced mode per default if set in the configuration', inject(function(simpleMode) {
      expect(simpleMode.isActive()).to.eql(false);
    }));

  });

  describe('interaction', function() {

    beforeEach(bootstrapModeler(booleanXML, { advancedMode: false }));

    it('should have a dropdown for booleans', inject(function(elementRegistry) {
      var cellUnderConsideration = elementRegistry.getGraphics('cell_output1_rule1');
      expect(cellUnderConsideration.querySelector('select')).to.exist;
    }));

    it('should show the real values after activating advanced mode', inject(function(elementRegistry, simpleMode) {
      simpleMode.deactivate();

      var cellUnderConsideration = elementRegistry.getGraphics('cell_output1_rule1');
      expect(cellUnderConsideration.querySelector('select')).to.not.exist;
      expect(cellUnderConsideration.querySelector('span').textContent).to.eql('false');

      cellUnderConsideration = elementRegistry.getGraphics('cell_input1_rule1');
      expect(cellUnderConsideration.querySelector('span').textContent).to.include('"');
    }));

  });

  describe('methods', function() {

    beforeEach(bootstrapModeler(basicXML, { advancedMode: false }));

    describe('#isString', function() {

      it('should be true', inject(function(simpleMode) {
        [
          '',
          '"hello world"',
          '""bar foo""',
          '""bar , foo""',
          '"bar , foo"'
        ].forEach(function(str) {
          expect(simpleMode.isString(str)).to.be.true;
        });
      }));

      it('should be false', inject(function(simpleMode) {
        [
          '"123',
          'bar"',
          '"foo" bar"',
          '"foo", "',
          '"foo", "bar"',
          '"foo" , "bar"',
          '"foo","bar"',
          '"foo" ,"bar", hello"',
          '"foo" , "bar", "hello"',
          '""foo"","bar"'
        ].forEach(function(str) {
          expect(simpleMode.isString(str)).to.be.false;
        });
      }));

    });

  });

});
