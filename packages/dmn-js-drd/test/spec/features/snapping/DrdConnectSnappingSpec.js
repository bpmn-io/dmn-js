/* global sinon */

import {
  bootstrapModeler,
  inject
} from '../../../TestHelper';

import connectModule from 'diagram-js/lib/features/connect';
import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import snappingModule from 'src/features/snapping';

import {
  createCanvasEvent as canvasEvent
} from 'test/util/MockEvents';

import {
  asTRBL,
  getMid
} from 'diagram-js/lib/layout/LayoutUtil';

import diagramXML from './DrdConnectSnapping.dmn';

var spy = sinon.spy;

var VERY_LOW_PRIORITY = 125;


describe('features/snapping - drd connect snapping', function() {

  var testModules = [
    connectModule,
    coreModule,
    modelingModule,
    snappingModule
  ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should snap', inject(function(connect, dragging, eventBus, elementRegistry) {

    // given
    var connectMoveSpy = spy(function(event) {
      var context = event.context,
          connectionStart = context.connectionStart,
          connectionEnd = context.connectionEnd;

      expect(connectionStart).to.eql({
        x: decision1Mid.x,
        y: decision1Trbl.top // 280 snapped to 240
      });

      expect(connectionEnd).to.eql({
        x: decision4Mid.x,
        y: decision4Trbl.bottom // 120 snapped to 160
      });
    });

    eventBus.once('connect.move', VERY_LOW_PRIORITY, connectMoveSpy);

    var decision1 = elementRegistry.get('Decision_1'),
        decision1Mid = getMid(decision1),
        decision1Trbl = asTRBL(decision1),
        decision4 = elementRegistry.get('Decision_4'),
        decision4Mid = getMid(decision4),
        decision4Trbl = asTRBL(decision4);

    // when
    connect.start(canvasEvent(getMid(decision1)), decision1);

    dragging.hover({ element: decision4, gfx: elementRegistry.getGraphics(decision4) });

    dragging.move(canvasEvent(decision4Mid));

    // then
    expect(connectMoveSpy).to.have.been.called;
  }));


  it('should unsnap', inject(function(connect, dragging, elementRegistry) {

    // given
    var decision1 = elementRegistry.get('Decision_1'),
        decision4 = elementRegistry.get('Decision_4'),
        knowledgeSource = elementRegistry.get('KnowledgeSource_1');

    connect.start(canvasEvent(getMid(decision1)), decision1, true);

    dragging.move(canvasEvent(getMid(decision4)));

    dragging.hover({ element: decision4, gfx: elementRegistry.getGraphics(decision4) });

    // when
    dragging.move(canvasEvent(getMid(knowledgeSource)));

    dragging.hover({
      element: knowledgeSource,
      gfx: elementRegistry.getGraphics(knowledgeSource)
    });

    dragging.end();

    // then
    var waypoints = decision1.outgoing[ 0 ].waypoints;

    expect(waypoints[ 0 ].original).to.eql(getMid(decision1));
    expect(waypoints[ 1 ].original).to.eql(getMid(knowledgeSource));
  }));

});