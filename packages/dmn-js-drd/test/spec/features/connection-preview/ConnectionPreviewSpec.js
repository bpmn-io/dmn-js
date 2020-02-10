import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import connectionPreviewModule from 'diagram-js/lib/features/connection-preview';
import bendpointsModule from 'diagram-js/lib/features/bendpoints';
import connectModule from 'diagram-js/lib/features/connect';
import coreModule from 'lib/core';
import modelingModule from 'lib/features/modeling';
import createModule from 'diagram-js/lib/features/create';

import {
  createCanvasEvent as canvasEvent
} from 'test/util/MockEvents';


describe('features/connection-preview', function() {

  var testModules = [
    connectionPreviewModule,
    connectModule,
    bendpointsModule,
    coreModule,
    createModule,
    modelingModule
  ];

  var testXML = require('./ConnectionPreview.dmn');

  beforeEach(bootstrapModeler(testXML, {
    modules: testModules
  }));


  it('should correctly lay out new connection preview',
    inject(function(connect, dragging, elementRegistry) {

      // given
      var source = elementRegistry.get('elMenu'),
          target = elementRegistry.get('guestCount');

      // when
      connect.start(canvasEvent({ x: 490, y: 310 }), source);

      dragging.move(canvasEvent({ x: 480, y: 260 }));
      dragging.hover({ element: target });
      dragging.move(canvasEvent({ x: 320, y: 200 }));

      var ctx = dragging.context();
      var context = ctx.data.context;

      var connectionPreview = context.getConnection(
        context.canExecute,
        context.source,
        context.target
      );

      var waypointsPreview = connectionPreview.waypoints.slice();

      dragging.end();

      // then
      expect(source.outgoing[1]).to.have.waypoints(waypointsPreview);
    })
  );


  it('should correctly lay out connection preview on reconnect start',
    inject(function(canvas, bendpointMove, dragging, elementRegistry) {

      // given
      var target = elementRegistry.get('guest_ks'),
          targetGfx = canvas.getGraphics(target),
          connection = elementRegistry.get('InformationRequirement');


      // when
      bendpointMove.start(canvasEvent({ x: 450, y: 275 }), connection, 0);

      dragging.move(canvasEvent({ x: 480, y: 300 }));
      dragging.hover({ element: target, gfx: targetGfx });
      dragging.move(canvasEvent({ x: 560, y: 180 }));

      var ctx = dragging.context();
      var context = ctx.data.context;

      var connectionPreview = context.getConnection(
        context.allowed,
        context.source,
        context.target
      );

      // hover dish-decision 333 102

      var waypointsPreview = connectionPreview.waypoints.slice();

      dragging.end();

      // then
      expect(target.outgoing[0]).to.have.waypoints(waypointsPreview);
    })
  );


  it('should correctly lay out connection preview on reconnect end',
    inject(function(canvas, bendpointMove, dragging, elementRegistry, eventBus) {

      // given
      var target = elementRegistry.get('dish-decision'),
          targetGfx = canvas.getGraphics(target),
          connection = elementRegistry.get('KnowledgeRequirement');

      // when
      bendpointMove.start(canvasEvent({ x: 450, y: 275 }), connection, 1);

      dragging.move(canvasEvent({ x: 420, y: 200 }));
      dragging.hover({ element: target, gfx: targetGfx });
      dragging.move(canvasEvent({ x: 285, y: 70 }));

      var ctx = dragging.context();
      var context = ctx.data.context;

      var connectionPreview = context.getConnection(
        context.allowed,
        context.source,
        context.target
      );

      var waypointsPreview = connectionPreview.waypoints.slice();

      dragging.end();

      // then
      expect(target.incoming[3]).to.have.waypoints(waypointsPreview);
    })
  );

});
