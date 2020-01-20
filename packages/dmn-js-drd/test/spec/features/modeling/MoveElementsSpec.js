import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';


describe('features/modeling - move elements', function() {

  var testModules = [ coreModule, modelingModule ];

  describe('shapes', function() {

    var exampleXML = require('../../../fixtures/dmn/di.dmn');

    beforeEach(bootstrapModeler(exampleXML, { modules: testModules }));


    it('should move', inject(function(elementRegistry, modeling, canvas) {

      // given
      var rootElement = canvas.getRootElement().businessObject,
          elements = elementRegistry.filter(function(element) {
            return element.parent;
          }),
          decision = elementRegistry.get('dish-decision').businessObject,
          inforReqLen = decision.informationRequirement.length,
          authReqLen = decision.authorityRequirement.length,
          drgElementsLen = rootElement.drgElement.length,
          artifactsLen = rootElement.get('artifact').length;

      // when
      modeling.moveElements(elements, { x: 0, y: 50 });

      // then
      expect(rootElement.drgElement).to.have.length(drgElementsLen);
      expect(rootElement.get('artifact')).to.have.length(artifactsLen);

      expect(decision.informationRequirement).to.have.length(inforReqLen);
      expect(decision.authorityRequirement).to.have.length(authReqLen);
    }));


    it('should undo', inject(function(elementRegistry, commandStack, modeling, canvas) {

      // given
      var rootElement = canvas.getRootElement().businessObject,
          elements = elementRegistry.filter(function(element) {
            return element.parent;
          }),
          decision = elementRegistry.get('dish-decision').businessObject,
          inforReqLen = decision.informationRequirement.length,
          authReqLen = decision.authorityRequirement.length,
          drgElementsLen = rootElement.drgElement.length,
          artifactsLen = rootElement.get('artifact').length;

      // when
      modeling.moveElements(elements, { x: 0, y: 50 });

      commandStack.undo();

      // then
      expect(rootElement.drgElement).to.have.length(drgElementsLen);
      expect(rootElement.get('artifact')).to.have.length(artifactsLen);

      expect(decision.informationRequirement).to.have.length(inforReqLen);
      expect(decision.authorityRequirement).to.have.length(authReqLen);
    }));


    it('should redo', inject(function(elementRegistry, commandStack, modeling, canvas) {

      // given
      var rootElement = canvas.getRootElement().businessObject,
          elements = elementRegistry.filter(function(element) {
            return element.parent;
          }),
          decision = elementRegistry.get('dish-decision').businessObject,
          inforReqLen = decision.informationRequirement.length,
          authReqLen = decision.authorityRequirement.length,
          drgElementsLen = rootElement.drgElement.length,
          artifactsLen = rootElement.get('artifact').length;

      // when
      modeling.moveElements(elements, { x: 0, y: 50 });

      commandStack.undo();
      commandStack.redo();

      // then
      expect(rootElement.drgElement).to.have.length(drgElementsLen);
      expect(rootElement.get('artifact')).to.have.length(artifactsLen);

      expect(decision.informationRequirement).to.have.length(inforReqLen);
      expect(decision.authorityRequirement).to.have.length(authReqLen);
    }));

  });

  describe('connections', function() {

    var associationXML = require('../../../fixtures/dmn/connections-lost.dmn');

    beforeEach(bootstrapModeler(associationXML, { modules: testModules }));


    it('should update di waypoints', inject(function(elementRegistry, modeling, canvas) {

      // given
      var elements = elementRegistry.filter(function(element) {
            return element.parent;
          }),
          decision = elementRegistry.get('Decision_1'),
          connection = decision.incoming[0],
          connectionDI = connection.businessObject.di;

      // when
      modeling.moveElements(elements, { x: 0, y: 50 });

      // then
      expectCoordinatesToMatch(connectionDI.waypoint, connection.waypoints);
    }));


    it('should update di waypoints -> undo', inject(
      function(elementRegistry, modeling, canvas, commandStack) {

        // given
        var elements = elementRegistry.filter(function(element) {
              return element.parent;
            }),
            decision = elementRegistry.get('Decision_1'),
            connection = decision.incoming[0],
            connectionDI = connection.businessObject.di;

        // when
        modeling.moveElements(elements, { x: 0, y: 50 });

        commandStack.undo();

        // then
        expectCoordinatesToMatch(connectionDI.waypoint, connection.waypoints);
      }
    ));

  });

});


// helper /////
function expectCoordinatesToMatch(waypointsA, waypointsB) {
  waypointsA.forEach(function(a, index) {
    const b = waypointsB[index];

    expect(a.x).to.eql(b.x);
    expect(a.y).to.eql(b.y);
  });
}