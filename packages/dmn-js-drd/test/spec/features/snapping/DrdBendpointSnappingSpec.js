/* global sinon */

import {
  bootstrapModeler,
  inject
} from '../../../TestHelper';

import bendpointsModule from 'diagram-js/lib/features/bendpoints';
import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import snappingModule from 'src/features/snapping';

import {
  createCanvasEvent as canvasEvent
} from 'test/util/MockEvents';

import { getMid, asTRBL } from 'diagram-js/lib/layout/LayoutUtil';

import diagramXML from './DrdBendpointSnapping.dmn';

var spy = sinon.spy;

var VERY_LOW_PRIORITY = 125;


describe('features/snapping - drd bendpoint snapping', function() {

  var testModules = [
    bendpointsModule,
    coreModule,
    modelingModule,
    snappingModule
  ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('reconnect start', function() {

    it('should snap source and target', inject(
      function(bendpointMove, dragging, elementRegistry, eventBus) {

        // given
        var bendpointMoveSpy = spy(function(event) {
          var context = event.context,
              hints = context.hints,
              connectionEnd = hints.connectionEnd;

          // snap event to source
          expect(event).to.include({
            x: decision4Trbl.left, // 610 snapped to 500
            y: decision4Mid.y, // 180 snapped to 160
            dx: 235,
            dy: -100
          });

          // snap connection end to target
          expect(connectionEnd).to.eql({
            x: decision1Trbl.right,
            y: decision1Mid.y
          });
        });

        eventBus.once('bendpoint.move.move', VERY_LOW_PRIORITY, bendpointMoveSpy);

        var decision1 = elementRegistry.get('Decision_1'),
            decision1Mid = getMid(decision1),
            decision1Trbl = asTRBL(decision1),
            decision4 = elementRegistry.get('Decision_4'),
            decision4Mid = getMid(decision4),
            decision4Trbl = asTRBL(decision4),
            informationRequirement = elementRegistry.get('InformationRequirement_1');

        // when
        bendpointMove.start(
          canvasEvent(getFirstWaypoint(informationRequirement)),
          informationRequirement,
          0
        );

        dragging.hover({
          element: decision4,
          gfx: elementRegistry.getGraphics(decision4)
        });

        dragging.move(canvasEvent({
          x: decision4Mid.x + 20,
          y: decision4Mid.y + 20
        }));

        // then
        expect(bendpointMoveSpy).to.have.been.called;
      }
    ));

  });


  describe('reconnect end', function() {

    it('should snap source and target', inject(
      function(bendpointMove, dragging, elementRegistry, eventBus) {

        // given
        var bendpointMoveSpy = spy(function(event) {
          var context = event.context,
              hints = context.hints,
              connectionStart = hints.connectionStart;

          // snap connection start to source
          expect(connectionStart).to.eql({
            x: decision2Trbl.right,
            y: decision2Mid.y
          });

          // snap event to target
          expect(event).to.include({
            x: decision3Trbl.left, // 630 snapped to 520
            y: decision3Mid.y + 20, // not snapped
            dx: 265,
            dy: 160
          });
        });

        eventBus.once('bendpoint.move.move', VERY_LOW_PRIORITY, bendpointMoveSpy);

        var decision2 = elementRegistry.get('Decision_2'),
            decision2Mid = getMid(decision2),
            decision2Trbl = asTRBL(decision2),
            decision3 = elementRegistry.get('Decision_3'),
            decision3Mid = getMid(decision3),
            decision3Trbl = asTRBL(decision3),
            informationRequirement = elementRegistry.get('InformationRequirement_1');

        // when
        bendpointMove.start(
          canvasEvent(getLastWaypoint(informationRequirement)),
          informationRequirement,
          getLastWaypointIndex(informationRequirement)
        );

        dragging.hover({
          element: decision3,
          gfx: elementRegistry.getGraphics(decision3)
        });

        dragging.move(canvasEvent({
          x: decision3Mid.x + 20,
          y: decision3Mid.y + 20
        }));

        // then
        expect(bendpointMoveSpy).to.have.been.called;
      })
    );

  });

});


// helpers //////////

function getFirstWaypoint(connection) {
  var waypoints = connection.waypoints;

  return waypoints[ 0 ];
}

function getLastWaypoint(connection) {
  var waypoints = connection.waypoints;

  return waypoints[ getLastWaypointIndex(connection) ];
}

function getLastWaypointIndex(connection) {
  var waypoints = connection.waypoints;

  return waypoints.length - 1;
}