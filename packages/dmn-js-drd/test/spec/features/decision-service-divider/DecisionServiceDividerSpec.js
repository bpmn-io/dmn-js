import {
  bootstrapModeler,
  inject
} from '../../../TestHelper';

import {
  createCanvasEvent as canvasEvent
} from 'test/util/MockEvents';

import coreModule from 'src/core';
import decisionServiceDividerModule from 'src/features/decision-service-divider';
import modelingModule from 'src/features/modeling';

import {
  MIN_SECTION_HEIGHT
} from 'src/features/decision-service-divider/DecisionServiceDivider';


describe('features/decision-service-divider', function() {

  var diagramXML = require('./decision-service-divider.dmn');

  var testModules = [
    coreModule,
    decisionServiceDividerModule,
    modelingModule
  ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('move', function() {

    it('should move', inject(function(decisionServiceDivider, dragging, elementRegistry) {

      // given
      var decisionService = elementRegistry.get('DecisionService_1');

      // when
      drag(decisionServiceDivider, dragging, decisionService, 260);

      // then
      expect(getWaypoints(decisionService)).to.eql([
        { x: 100, y: 260 },
        { x: 500, y: 260 }
      ]);
    }));


    it('should undo', inject(
      function(commandStack, decisionServiceDivider, dragging, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1');

        drag(decisionServiceDivider, dragging, decisionService, 260);

        // when
        commandStack.undo();

        // then
        expect(getDividerY(decisionService)).to.equal(250);
      }
    ));


    it('should redo', inject(
      function(commandStack, decisionServiceDivider, dragging, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1');

        drag(decisionServiceDivider, dragging, decisionService, 260);

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(getDividerY(decisionService)).to.equal(260);
      }
    ));


    it('should not execute command if position did not change', inject(
      function(commandStack, decisionServiceDivider, dragging, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1');

        // when
        drag(decisionServiceDivider, dragging, decisionService, 250);

        // then
        expect(commandStack.canUndo()).to.be.false;
      }
    ));


    it('should hide rendered divider while dragging', inject(
      function(canvas, decisionServiceDivider, dragging, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1');

        // when
        decisionServiceDivider.activate(
          canvasEvent({ x: decisionService.x + 10, y: getDividerY(decisionService) }),
          decisionService
        );

        dragging.move(canvasEvent({ x: decisionService.x + 10, y: 260 }));

        // then
        expect(canvas.hasMarker(decisionService, 'djs-divider-dragging')).to.be.true;

        // when
        dragging.end();

        // then
        expect(canvas.hasMarker(decisionService, 'djs-divider-dragging')).to.be.false;
      }
    ));

  });


  describe('constraints', function() {

    it('should stop at encapsulated decision', inject(
      function(decisionServiceDivider, dragging, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            encapsulated = elementRegistry.get('Decision_Encapsulated');

        // when
        drag(decisionServiceDivider, dragging, decisionService, 400);

        // then
        expect(getDividerY(decisionService)).to.equal(encapsulated.y);
      }
    ));


    it('should stop at output decision', inject(
      function(decisionServiceDivider, dragging, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            output = elementRegistry.get('Decision_Output');

        // when
        drag(decisionServiceDivider, dragging, decisionService, 0);

        // then
        expect(getDividerY(decisionService)).to.equal(output.y + output.height);
      }
    ));


    it('should keep minimum section height', inject(
      function(decisionServiceDivider, dragging, elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_Empty');

        // when
        drag(decisionServiceDivider, dragging, decisionService, 10000);

        // then
        expect(getDividerY(decisionService)).to.equal(
          decisionService.y + decisionService.height - MIN_SECTION_HEIGHT
        );
      }
    ));

  });


  describe('handle', function() {

    it('should add to selected decision service', inject(
      function(canvas, elementRegistry, selection) {

        // when
        selection.select(elementRegistry.get('DecisionService_1'));

        // then
        expect(getHandles(canvas)).to.have.lengthOf(1);
      }
    ));


    it('should not add to other elements', inject(
      function(canvas, elementRegistry, selection) {

        // when
        selection.select(elementRegistry.get('Decision_Output'));

        // then
        expect(getHandles(canvas)).to.have.lengthOf(0);
      }
    ));


    it('should not add if sections do not fit', inject(
      function(canvas, elementRegistry, modeling, selection) {

        // given
        var decisionService = elementRegistry.get('DecisionService_Empty');

        modeling.resizeShape(decisionService, {
          x: decisionService.x,
          y: decisionService.y,
          width: decisionService.width,
          height: (2 * MIN_SECTION_HEIGHT) - 1
        });

        // when
        selection.select(decisionService);

        // then
        expect(getHandles(canvas)).to.have.lengthOf(0);
      }
    ));


    it('should remove on deselect', inject(
      function(canvas, elementRegistry, selection) {

        // given
        selection.select(elementRegistry.get('DecisionService_1'));

        // when
        selection.select(null);

        // then
        expect(getHandles(canvas)).to.have.lengthOf(0);
      }
    ));

  });

});


// helpers //////////

function getWaypoints(decisionService) {
  return decisionService.businessObject.di.decisionServiceDividerLine.waypoint.map(
    function(waypoint) {
      return { x: waypoint.x, y: waypoint.y };
    }
  );
}

function getDividerY(decisionService) {
  return getWaypoints(decisionService)[0].y;
}

function getHandles(canvas) {
  return canvas.getLayer('dividers').querySelectorAll('.djs-divider-handle');
}

function drag(decisionServiceDivider, dragging, decisionService, y) {
  decisionServiceDivider.activate(
    canvasEvent({ x: decisionService.x + 10, y: getDividerY(decisionService) }),
    decisionService
  );

  dragging.move(canvasEvent({ x: decisionService.x + 10, y: y }));
  dragging.end();
}