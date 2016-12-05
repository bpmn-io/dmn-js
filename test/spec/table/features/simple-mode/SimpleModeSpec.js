'use strict';

require('../../TestHelper');

var booleanXML = require('../../../../fixtures/dmn/boolean.dmn'),
    basicXML = require('../../../../fixtures/dmn/new-table.dmn');

var mouseEvent = require('table-js/test/util/DOMEvents').performMouseEvent;

/* global bootstrapModeler, inject, sinon */


describe('features/simple-mode', function() {

  describe('integration', function() {
    var modeler;

    beforeEach(function(done) {
      modeler = bootstrapModeler(basicXML)(done);
    });

    it('should fire an event when initializing', function(done) {
      function initialized() {
        done();
      }

      var initializedSpy = sinon.spy(initialized);

      modeler.on('simpleMode.initialized', initializedSpy);

      modeler.importXML(basicXML, function(err) {
        if (err) {
          return done(err);
        }

        expect(initializedSpy).to.have.been.called;
      });
    });

    it('should fire an event when activating/deactivating',
      inject(function(simpleMode, eventBus, elementRegistry) {
        // given
        var activatedSpy = sinon.spy(function() {}),
            deactivatedSpy = sinon.spy(function() {});

        var button = simpleMode._node;

        eventBus.on('simpleMode.activated', activatedSpy);
        eventBus.on('simpleMode.deactivated', deactivatedSpy);

        // when
        mouseEvent('click', button);

        // then
        expect(deactivatedSpy).to.have.been.called;

        // when
        mouseEvent('click', button);

        // then
        expect(activatedSpy).to.have.been.called;
      }));

  });

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
