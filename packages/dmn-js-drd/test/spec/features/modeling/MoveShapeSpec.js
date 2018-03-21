'use strict';

var pick = require('min-dash').pick;

require('../../../TestHelper');

/* global bootstrapModeler, inject */


var modelingModule = require('lib/features/modeling'),
    coreModule = require('lib/core');


describe('features/modeling - move shape', function() {

  var testModules = [ coreModule, modelingModule ];

  describe('shapes', function() {

    var knowledgeSourceXML = require('../../../fixtures/dmn/knowledge-source.dmn');

    beforeEach(bootstrapModeler(knowledgeSourceXML, { modules: testModules }));

    it('should move', inject(function(elementRegistry, modeling, drdFactory) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          businessObject = knowledgeSource.businessObject,
          bounds = businessObject.extensionElements.values[0];

      var oldPosition = {
        x: knowledgeSource.x,
        y: knowledgeSource.y
      };

      // when
      modeling.moveShape(knowledgeSource, { x: 0, y: 50 });

      // then
      expect(pick(bounds, [ 'x', 'y' ])).to.eql({
        x: oldPosition.x,
        y: oldPosition.y + 50
      });
    }));


    it('should undo', inject(function(elementRegistry, commandStack, modeling) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          businessObject = knowledgeSource.businessObject,
          bounds = businessObject.extensionElements.values[0];

      var oldPosition = {
        x: knowledgeSource.x,
        y: knowledgeSource.y
      };

      modeling.moveShape(knowledgeSource, { x: 0, y: 50 });

      // when
      commandStack.undo();

      // then
      expect(pick(bounds, [ 'x', 'y' ])).to.eql(oldPosition);
    }));


    it('should redo', inject(function(elementRegistry, commandStack, modeling) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          businessObject = knowledgeSource.businessObject,
          bounds = businessObject.extensionElements.values[0];


      modeling.moveShape(knowledgeSource, { x: 0, y: 50 });

      var newPosition = {
        x: knowledgeSource.x,
        y: knowledgeSource.y
      };

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(pick(bounds, [ 'x', 'y' ])).to.eql(newPosition);
    }));

  });


  describe('connections', function() {

    var simpleConnectionsXML = require('../../../fixtures/dmn/simple-connections.dmn');

    beforeEach(bootstrapModeler(simpleConnectionsXML, { modules: testModules }));

    it('should handle bendpoints', inject(function(elementRegistry, modeling) {
      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          decision = elementRegistry.get('guestCount'),
          businessObject = knowledgeSource.businessObject,
          edge = businessObject.extensionElements.values[1],
          sourceWaypoint;

      // apply cropping
      modeling.layoutConnection(knowledgeSource.incoming[0]);

      // when
      sourceWaypoint = pick(edge.waypoints[0], [ 'x', 'y' ]);

      modeling.moveShape(decision, { x: 50, y: 0 });

      // then
      expect(edge.waypoints).to.have.length(3);

      expect(pick(edge.waypoints[0], [ 'x', 'y' ])).to.eql({
        x: sourceWaypoint.x + 38,
        y: sourceWaypoint.y
      });
    }));


    it('should update requirement', inject(function(elementRegistry, modeling) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          decision = elementRegistry.get('guestCount'),
          businessObject = knowledgeSource.businessObject,
          edge = businessObject.extensionElements.values[1],
          sourceWaypoint;

      // apply cropping
      modeling.layoutConnection(knowledgeSource.incoming[0]);

      // when
      sourceWaypoint = pick(edge.waypoints[0], [ 'x', 'y' ]);

      modeling.moveShape(decision, { x: 50, y: 0 });

      // then
      expect(pick(edge.waypoints[0], [ 'x', 'y' ])).to.eql({
        x: sourceWaypoint.x + 38,
        y: sourceWaypoint.y
      });
    }));


    it('should update association', inject(function(elementRegistry, modeling) {

      // given
      var association = elementRegistry.get('Association_1c4jixb'),
          inputData = elementRegistry.get('dayType_id'),
          businessObject = association.businessObject,
          edge = businessObject.extensionElements.values[0],
          sourceWaypoint;

      // apply cropping
      modeling.layoutConnection(association);

      // when
      sourceWaypoint = pick(edge.waypoints[0], [ 'x', 'y' ]);

      modeling.moveShape(inputData, { x: 50, y: 0 });

      // then
      expect(pick(edge.waypoints[0], [ 'x', 'y' ])).to.eql({
        x: sourceWaypoint.x + 42,
        y: sourceWaypoint.y
      });
    }));


    it('should undo requirement update', inject(
      function(elementRegistry, modeling, commandStack) {

        // given
        var knowledgeSource = elementRegistry.get('host_ks'),
            decision = elementRegistry.get('guestCount'),
            businessObject = knowledgeSource.businessObject,
            edge = businessObject.extensionElements.values[1],
            sourceWaypoint;

        // when
        sourceWaypoint = pick(edge.waypoints[0], [ 'x', 'y' ]);

        modeling.moveShape(decision, { x: 50, y: 0 });

        commandStack.undo();

        // then
        expect(pick(edge.waypoints[0], [ 'x', 'y' ])).to.eql({
          x: sourceWaypoint.x,
          y: sourceWaypoint.y
        });
      }
    ));


    it('should redo requirement update', inject(
      function(elementRegistry, modeling, commandStack) {

        // given
        var knowledgeSource = elementRegistry.get('host_ks'),
            decision = elementRegistry.get('guestCount'),
            businessObject = knowledgeSource.businessObject,
            edge = businessObject.extensionElements.values[1],
            sourceWaypoint;

        // apply cropping
        modeling.layoutConnection(knowledgeSource.incoming[0]);

        // when
        sourceWaypoint = pick(edge.waypoints[0], [ 'x', 'y' ]);

        modeling.moveShape(decision, { x: 50, y: 0 });

        commandStack.undo();

        commandStack.redo();

        // then
        expect(pick(edge.waypoints[0], [ 'x', 'y' ])).to.eql({
          x: sourceWaypoint.x + 38,
          y: sourceWaypoint.y
        });
      }
    ));

  });

});
