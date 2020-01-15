/* global sinon */

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';

var restore = sinon.restore;


describe('features/modeling - DrdUpdater', function() {

  var testModules = [ coreModule, modelingModule ];

  var diagramXML = require('./drd-updater.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  afterEach(restore);


  describe('crop connection', function() {

    it('should crop connection once', inject(
      function(connectionDocking, elementRegistry, modeling) {

        // given
        var source = elementRegistry.get('Decision_1'),
            connection = source.outgoing[0],
            target = elementRegistry.get('Decision_3'),
            getCroppedWaypointsSpy = sinon.spy(connectionDocking, 'getCroppedWaypoints');

        // when
        modeling.reconnectEnd(connection, target, getMid(target));

        // then
        expect(getCroppedWaypointsSpy.withArgs(connection)).to.have.been.calledOnce;
      }
    ));

  });


  describe('update parent', function() {

    it('should update parent', inject(
      function(elementFactory, elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject;

        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        // when
        modeling.createShape(decision, { x: 100, y: 100 }, definitions);

        // then
        var decisionBo = decision.businessObject;

        expect(decisionBo.$parent).to.equal(definitionsBo);
      }
    ));

  });


  describe('update bounds', function() {

    it('should update bounds on create', inject(
      function(elementFactory, elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1');

        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        // when
        modeling.createShape(decision, { x: 100, y: 100 }, definitions);

        // then
        var decisionBo = decision.businessObject,
            bounds = getBounds(decisionBo);

        expect(bounds).to.include({
          x: 10,
          y: 60,
          width: 180,
          height: 80
        });
      }
    ));


    it('should update bounds on move', inject(
      function(elementRegistry, modeling) {

        // given
        var decision = elementRegistry.get('Decision_1');

        // when
        modeling.moveShape(decision, { x: 100, y: 100 });

        // then
        var decisionBo = decision.businessObject,
            bounds = getBounds(decisionBo);

        expect(bounds).to.include({
          x: 257,
          y: 200,
          width: 180,
          height: 80
        });
      }
    ));

  });


  describe('update waypoints', function() {

    it('should update waypoint on connect', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_2'),
            decision2 = elementRegistry.get('Decision_3');

        // when
        var connection = modeling.connect(decision1, decision2);

        // then
        var edge = getEdge(connection);

        expect(edge.waypoint).to.have.lengthOf(2);
        expect(edge.waypoint[ 0 ]).to.include({ x: 247, y: 280 });
        expect(edge.waypoint[ 0 ].original).not.to.exist;
        expect(edge.waypoint[ 1 ]).to.include({ x: 247, y: 300 });
        expect(edge.waypoint[ 1 ].original).not.to.exist;
      }
    ));

    it('should update waypoints on move', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_1'),
            decision2 = elementRegistry.get('Decision_2'),
            informationRequirement = elementRegistry.get('InformationRequirement_1');

        // when
        modeling.moveElements([ decision1, decision2 ], { x: 100, y: 100 });

        // then
        var edge = getEdge(informationRequirement);

        expect(edge.waypoint).to.have.lengthOf(2);
        expect(edge.waypoint[ 0 ]).to.include({ x: 347, y: 240 });
        expect(edge.waypoint[ 0 ].original).not.to.exist;
        expect(edge.waypoint[ 1 ]).to.include({ x: 347, y: 340 });
        expect(edge.waypoint[ 1 ].original).not.to.exist;
      }
    ));

  });
});


// helpers //////////

function getBounds(businessObject) {
  return businessObject.di.bounds;
}

function getEdge(connection) {
  return connection.businessObject.di;
}