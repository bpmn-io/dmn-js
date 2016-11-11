'use strict';

var Modeler = require('../../../lib/table/Modeler');

var ComboBox = require('table-js/lib/features/combo-box');

var simpleXML = require('../../fixtures/dmn/simple.dmn'),
    emptyDefsXML = require('../../fixtures/dmn/empty-definitions.dmn'),
    oneOutputXML = require('../../fixtures/dmn/one-output.dmn'),
    oneInputXML = require('../../fixtures/dmn/one-input.dmn'),
    noRulesXML = require('../../fixtures/dmn/no-rules.dmn'),
    otherXML = require('../../fixtures/dmn/new-table.dmn');

var TestContainer = require('mocha-test-container-support');


describe('Table - Modeler', function() {

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  function createModeler(xml, done) {
    var modeler = new Modeler({ container: container });

    modeler.importXML(xml, function(err, warnings) {
      done(err, warnings, modeler);
    });
  }


  it('should import simple process', function(done) {
    createModeler(simpleXML, done);
  });


  it('should import empty definitions', function(done) {
    createModeler(emptyDefsXML, done);
  });


  it('should re-import simple process', function(done) {

    // given
    createModeler(simpleXML, function(err, warnings, modeler) {

      if (err) {
        return done(err);
      }

      // when
      // mimic re-import of same diagram
      modeler.importXML(simpleXML, function(err, warnings) {

        // then
        expect(err).to.not.exist;
        expect(warnings.length).to.eql(0);

        done();
      });

    });
  });


  it('should create input when loading a table with only an output', function(done) {

    createModeler(oneOutputXML, function(err, warnings, viewer) {
      // then
      expect(err).to.not.exist;
      expect(warnings).to.have.length(0);

      expect(viewer.definitions.drgElements[0].decisionTable.input).to.exist;
      expect(viewer.definitions.drgElements[0].decisionTable.input).to.have.length(1);

      done();
    });
  });


  it('should create output when loading a table with only an input', function(done) {

    createModeler(oneInputXML, function(err, warnings, viewer) {
      // then
      expect(err).to.not.exist;
      expect(warnings).to.have.length(0);

      expect(viewer.definitions.drgElements[0].decisionTable.output).to.exist;
      expect(viewer.definitions.drgElements[0].decisionTable.output).to.have.length(1);

      done();
    });
  });


  it('should create input when loading a table with multiple outputs and no rules', function(done) {

    createModeler(noRulesXML, function(err, warnings, viewer) {
      // then
      expect(err).to.not.exist;
      expect(warnings).to.have.length(0);

      expect(viewer.definitions.drgElements[0].decisionTable.input).to.exist;
      expect(viewer.definitions.drgElements[0].decisionTable.input).to.have.length(1);

      done();
    });
  });

  describe('defaults', function() {

    it('should use <body> as default parent', function(done) {

      var modeler = new Modeler();

      modeler.importXML(simpleXML, function(err, warnings) {

        expect(modeler.container.parentNode).to.eql(document.body);

        done(err, warnings);
      });
    });

  });


  describe('import events', function() {


    it('should emit <import.*> events', function(done) {

      // given
      var viewer = new Modeler({ container: container });

      var events = [];

      viewer.on([
        'import.parse.start',
        'import.parse.complete',
        'import.render.start',
        'import.render.complete',
        'import.done'
      ], function(e) {
        // log event type + event arguments
        events.push([
          e.type,
          Object.keys(e).filter(function(key) {
            return key !== 'type';
          })
        ]);
      });

      // when
      viewer.importXML(emptyDefsXML, function(err) {

        // then
        expect(events).to.eql([
          [ 'import.parse.start', [ 'xml' ] ],
          [ 'import.parse.complete', ['error', 'definitions', 'context' ] ],
          [ 'import.render.start', [ 'definitions' ] ],
          [ 'import.render.complete', [ 'error', 'warnings' ] ],
          [ 'import.done', [ 'error', 'warnings' ] ]
        ]);

        done(err);
      });

    });

  });

  describe('ids', function() {

    it('should provide ids with moddle', function() {

      // given
      var modeler = new Modeler({ container: container });

      // when
      var moddle = modeler.get('moddle');

      // then
      expect(moddle.ids).to.exist;
    });


    it('should populate ids on import', function(done) {

      // given
      var modeler = new Modeler({ container: container });

      var moddle = modeler.get('moddle');
      var elementRegistry = modeler.get('elementRegistry');

      // when
      modeler.importXML(simpleXML, function(err) {

        var column = elementRegistry.get('input1').businessObject;

        // then
        expect(moddle.ids.assigned('input1')).to.eql(column);

        done();
      });

    });


    it('should clear ids before re-import', function(done) {
      // given
      var modeler = new Modeler({ container: container });

      var moddle = modeler.get('moddle'),
          elementRegistry = modeler.get('elementRegistry');

      // when
      modeler.importXML(simpleXML, function(err) {
        if (err) {
          done(err);
        }

        modeler.importXML(otherXML, function(err) {
          var output2, input1;

          if (err) {
            done(err);
          }

          output2 = moddle.ids.assigned('output2');
          input1 = moddle.ids.assigned('input1');

          var column = elementRegistry.get('input1').businessObject;

          // then
          // not in other.dmn
          expect(output2).to.be.false;

          // in other.dmn
          expect(input1).to.eql(column);

          done();
        });
      });

    });

  });

  describe('dependency injection', function() {

    it('should provide self as <dmnjs>', function(done) {

      createModeler(simpleXML, function(err, warnings, modeler) {

        expect(modeler.get('dmnjs')).to.equal(modeler);

        done(err);
      });
    });


    it('should allow Diagram#get before import', function() {

      // when
      var modeler = new Modeler({ container: container });

      // then
      var eventBus = modeler.get('eventBus');

      expect(eventBus).to.exist;
    });


    it('should keep references to services across re-import', function(done) {

      // given
      var modeler = new Modeler({ container: container });

      var eventBus = modeler.get('eventBus'),
          sheet = modeler.get('sheet');

      // when
      modeler.importXML(simpleXML, function() {

        // then
        expect(modeler.get('sheet')).to.equal(sheet);
        expect(modeler.get('eventBus')).to.equal(eventBus);

        modeler.importXML(otherXML, function() {

          // then
          expect(modeler.get('sheet')).to.equal(sheet);
          expect(modeler.get('eventBus')).to.equal(eventBus);

          done();
        });
      });

    });

  });


  describe('destruction', function() {

    it('should close open combobox dropdowns on destruction', function(done) {

      // given
      createModeler(simpleXML, function(err, warnings, modeler) {

        var options = ['LIST', 'SUM', 'MIN', 'MAX', 'COUNT'];
        var comboBox = new ComboBox({
          label: 'ComboBox',
          options: options
        });

        container.appendChild(comboBox.getNode());

        comboBox._openDropdown(options);

        // make sure the dropdown is open
        expect(document.body.contains(comboBox._dropdown)).to.be.true;

        // when
        modeler.destroy();

        // then
        expect(document.body.contains(comboBox._dropdown)).to.be.false;

        done();
      });

    });

  });

});
