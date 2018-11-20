import {
  bootstrapModeler,
  getDrdJS,
  getDmnJS
} from 'test/TestHelper';

import exampleXML from '../../fixtures/dmn/di.dmn';
import multipleDecisionsXML from '../../fixtures/dmn/multiple-decisions.dmn';

import {
  pick
} from 'min-dash';


describe('DRD - Import', function() {

  describe('should connect', function() {

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


    it('decisions with information requirement', function() {
      expectConnection({
        source: 'dmn:Decision',
        target: 'dmn:Decision',
        type: 'dmn:InformationRequirement'
      });
    });


    it('business knowledge model to decision with knowledge requirement', function() {
      expectConnection({
        source: 'dmn:BusinessKnowledgeModel',
        target: 'dmn:Decision',
        type: 'dmn:KnowledgeRequirement'
      });
    });


    it('knowledge source to decision with authority requirement', function() {
      expectConnection({
        source: 'dmn:KnowledgeSource',
        target: 'dmn:Decision',
        type: 'dmn:AuthorityRequirement'
      });
    });


    it('input data to decision with information requirement', function() {
      expectConnection({
        source: 'dmn:InputData',
        target: 'dmn:Decision',
        type: 'dmn:InformationRequirement'
      });
    });


    it('input data to text annotation with an association', function() {
      expectConnection({
        source: 'dmn:InputData',
        target: 'dmn:TextAnnotation',
        type: 'dmn:Association'
      });
    });

  });



  describe('cropping', function() {

    beforeEach(bootstrapModeler(multipleDecisionsXML));

    var modeler;

    beforeEach(function() {
      modeler = getDmnJS();
    });


    it('should crop', function(done) {

      modeler.getActiveViewer().invoke(function(elementRegistry, modeling) {

        var connection = modeling.connect(
          elementRegistry.get('guestCount'),
          elementRegistry.get('season')
        );

        var waypoints = connection.waypoints.slice();

        modeler.saveXML(function(err, xml) {

          modeler.importXML(xml, function() {

            var decision = elementRegistry.get('guestCount');
            var importedConnection = decision.outgoing[0];

            expect(
              pick(importedConnection.waypoints[0], [ 'x', 'y' ])
            ).to.eql(pick(waypoints[0], [ 'x', 'y' ]));

            expect(
              pick(importedConnection.waypoints[1], [ 'x', 'y' ])
            ).to.eql(pick(waypoints[1], [ 'x', 'y' ]));

            done();
          });
        });
      });

    });

  });

});
