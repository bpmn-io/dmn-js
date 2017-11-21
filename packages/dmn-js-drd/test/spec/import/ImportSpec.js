'use strict';

/* global bootstrapModeler, getDrdJS, inject, getDmnJS */

var exampleXML = require('../../fixtures/dmn/di.dmn'),
    multipleDecisionsXML = require('../../fixtures/dmn/multiple-decisions.dmn');

var pick = require('lodash/object/pick');


describe('DRD - Import', function() {

  describe('connection types', function() {

    function getConnection(sourceType, targetType) {
      return getDrdJS().invoke(function(elementRegistry) {
        var match;

        elementRegistry.forEach(function(el) {
          if (el.source && el.source.type === sourceType &&
             el.target && el.target.type === targetType) {
            match = el;
          }
        });

        return match;
      });
    }

    function expectConnection(config) {

      // given
      var connection = getConnection(config.source, config.target);

      // then
      expect(connection).to.exist;

      // when
      var businessObject = connection.businessObject,
          edge;

      // then
      expect(connection.type).to.equal(config.type);
      expect(connection.waypoints).to.have.length(2);

      expect(businessObject.$type).to.equal(config.type);

      if (config.type === 'dmn:Association') {
        edge = businessObject.extensionElements.values[0];
      } else {
        edge = connection.target.businessObject.extensionElements.values[1];
      }

      expect(edge.$type).to.equal('biodi:Edge');
      expect(edge.waypoints).to.have.length(2);
    }

    before(bootstrapModeler(exampleXML));


    it('should connect decisions with information requirement', function() {
      expectConnection({
        source: 'dmn:Decision',
        target: 'dmn:Decision',
        type: 'dmn:InformationRequirement'
      });
    });


    it('should connect business knowledge model to decisions with knowledge requirement', function() {
      expectConnection({
        source: 'dmn:BusinessKnowledgeModel',
        target: 'dmn:Decision',
        type: 'dmn:KnowledgeRequirement'
      });
    });


    it('should connect knowledge source to decisions with authority requirement', function() {
      expectConnection({
        source: 'dmn:KnowledgeSource',
        target: 'dmn:Decision',
        type: 'dmn:AuthorityRequirement'
      });
    });


    it('should connect input data to decisions with information requirement', function() {
      expectConnection({
        source: 'dmn:InputData',
        target: 'dmn:Decision',
        type: 'dmn:InformationRequirement'
      });
    });


    it('should connect input data to text annotation with an association', function() {
      expectConnection({
        source: 'dmn:InputData',
        target: 'dmn:TextAnnotation',
        type: 'dmn:Association'
      });
    });

  });



  describe('cropping', function(done) {

    beforeEach(bootstrapModeler(multipleDecisionsXML));

    var modeler;

    beforeEach(function() {
      modeler = getDmnJS();
    });


    it('should crop', inject(function(elementRegistry, modeling) {

      var connection = modeling.connect(
        elementRegistry.get('guestCount'),
        elementRegistry.get('season')
      );

      var waypoints = connection.waypoints.slice();

      modeler.saveXML(function(err, xml) {

        modeler.importXML(xml, function() {

          var decision = elementRegistry.get('guestCount');
          var importedConnection = decision.outgoing[0];

          expect(pick(importedConnection.waypoints[0], [ 'x', 'y' ])).to.eql(pick(waypoints[0], [ 'x', 'y' ]));
          expect(pick(importedConnection.waypoints[1], [ 'x', 'y' ])).to.eql(pick(waypoints[1], [ 'x', 'y' ]));

          done();
        });
      });

    }));

  });

});
