import {
  bootstrapModeler,
  getDrdJS,
  getDmnJS
} from 'test/TestHelper';

import exampleXML from '../../fixtures/dmn/di-1-3.dmn';
import multipleDecisionsXML from '../../fixtures/dmn/multiple-decisions.dmn';

import {
  pick
} from 'min-dash';


describe('DRD - Import', function() {

  describe('events', function() {

    beforeEach(bootstrapModeler(exampleXML));


    it('should fire <import.start> and <import.done>', function(done) {

      // given
      var dmnJS = getDmnJS(),
          eventBus = getDrdJS().get('eventBus'),
          events = [];

      eventBus.on('import.start', function() {
        events.push('import.start');
      });
      eventBus.on('import.done', function() {
        events.push('import.done');
      });

      // when
      dmnJS.importXML(exampleXML, function(error) {

        // then
        expect(events).to.eql([
          'import.start',
          'import.done'
        ]);

        done(error);
      });
    });


    it('should fire <drdElement.added>', function(done) {

      // given
      var dmnJS = getDmnJS(),
          drdJS = getDrdJS(),
          eventsCount = 0;

      drdJS.get('eventBus').on('drdElement.added', function(event) {
        eventsCount++;
      });

      // when
      dmnJS.importXML(exampleXML, function(error) {

        // then
        expect(eventsCount).to.eql(15);
        done(error);
      });
    });

  });


  describe('should connect', function() {

    function getConnection(source, target) {
      return getDrdJS().invoke(function(elementRegistry) {
        var match;

        elementRegistry.forEach(function(el) {
          if (el.source && el.source.id === source &&
             el.target && el.target.id === target) {
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
      expect(connection.waypoints).to.exist;
      expect(connection.waypoints).to.have.length(2);

      expect(businessObject.$type).to.equal(config.type);

      edge = businessObject.di;

      expect(edge.$type).to.equal('dmndi:DMNEdge');
      expect(edge.waypoint).to.exist;
      expect(edge.waypoint).to.have.length(2);
    }

    before(bootstrapModeler(exampleXML));


    it('decisions with information requirement', function() {
      expectConnection({
        source: 'season',
        target: 'dish',
        type: 'dmn:InformationRequirement'
      });
    });


    it('business knowledge model to decision with knowledge requirement', function() {
      expectConnection({
        source: 'menu',
        target: 'dish',
        type: 'dmn:KnowledgeRequirement'
      });
    });


    it('knowledge source to decision with authority requirement', function() {
      expectConnection({
        source: 'host_ks',
        target: 'dish',
        type: 'dmn:AuthorityRequirement'
      });
    });


    it('input data to decision with information requirement', function() {
      expectConnection({
        source: 'dayType_id',
        target: 'guestCount',
        type: 'dmn:InformationRequirement'
      });
    });


    it('input data to text annotation with an association', function() {
      expectConnection({
        source: 'dayType_id',
        target: 'TextAnnotation_1t4zaz9',
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
