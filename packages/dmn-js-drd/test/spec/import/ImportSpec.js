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

    let events = [];

    const TRACKED_EVENTS = [
      'import.start',
      'import.done',
      'drdElement.added'
    ];

    beforeEach(bootstrapModeler(exampleXML, {
      additionalModules: [ {
        __init__: [ 'eventListener' ],
        eventListener: [ 'type', createEventListener(TRACKED_EVENTS, events) ]
      } ]
    }));

    beforeEach(function() {
      events.length = 0;
    });


    it('should fire <import.start> and <import.done>', async function() {

      // given
      const dmnJS = getDmnJS();

      // when
      await dmnJS.importXML(exampleXML);

      // then
      const filteredEvents = events.filter(event => [
        'import.start',
        'import.done'
      ].includes(event));

      expect(filteredEvents).to.eql([
        'import.start',
        'import.done'
      ]);
    });


    it('should fire <drdElement.added>', async function() {

      // given
      const dmnJS = getDmnJS();

      // when
      await dmnJS.importXML(exampleXML);

      // then
      const filteredEvents = events.filter(event => event === 'drdElement.added');

      expect(filteredEvents).to.have.lengthOf(15);
    });

  });


  describe('should connect', function() {

    function getConnection(source, target) {
      return getDrdJS().invoke(function(elementRegistry) {
        let match;

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
      const connection = getConnection(config.source, config.target);

      // then
      expect(connection).to.exist;

      // when
      const businessObject = connection.businessObject;
      let edge;

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

    let modeler;

    beforeEach(function() {
      modeler = getDmnJS();
    });


    it('should crop', function() {

      return modeler.getActiveViewer().invoke(function(elementRegistry, modeling) {

        const connection = modeling.connect(
          elementRegistry.get('guestCount'),
          elementRegistry.get('season')
        );

        const waypoints = connection.waypoints.slice();

        return modeler.saveXML().then(({ xml }) => {

          return modeler.importXML(xml).then(function() {

            const elementRegistry = modeler.getActiveViewer().get('elementRegistry');

            const decision = elementRegistry.get('guestCount');
            const importedConnection = decision.outgoing[0];

            expect(
              pick(importedConnection.waypoints[0], [ 'x', 'y' ])
            ).to.eql(pick(waypoints[0], [ 'x', 'y' ]));

            expect(
              pick(importedConnection.waypoints[1], [ 'x', 'y' ])
            ).to.eql(pick(waypoints[1], [ 'x', 'y' ]));
          });
        });
      });

    });

  });

});

function createEventListener(eventNames, events) {
  return function(eventBus) {
    eventBus.on(eventNames, function(event) {
      events.push(event.type);
    });
  };
}
