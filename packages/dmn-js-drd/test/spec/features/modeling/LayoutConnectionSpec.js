import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import {
  pick
} from 'min-dash';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';


describe('features/modeling - layout connection', function() {

  var diagramXML = require('../../../fixtures/dmn/simple-connections.dmn');

  var testModules = [ coreModule, modelingModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('connection handling', function() {

    it('should execute', inject(function(elementRegistry, modeling, drdFactory) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          authorityRequirementConn = knowledgeSource.incoming[0],
          requirement = elementRegistry.get('AuthorityRequirement_0jdv0hj'),
          businessObject = requirement.businessObject,
          edge = businessObject.di;

      var expectedWaypoints = [
        {
          original: { x: 200, y: 38 },
          x: 212, y: 65
        },
        {
          original: { x: 250, y: 150 },
          x: 250, y: 150
        },
        {
          original: { x: 545, y: 182 },
          x: 495, y: 177
        }
      ];

      // when
      modeling.layoutConnection(authorityRequirementConn);

      // then

      // expect cropped, repaired connection
      // that was not actually modified
      expect(authorityRequirementConn.waypoints).to.eql(expectedWaypoints);

      // expect cropped waypoints in di
      expect(pick(edge.waypoint[0], [ 'x', 'y' ])).eql({ x: 212, y: 65 });
      expect(pick(edge.waypoint[2], [ 'x', 'y' ])).eql({ x: 495, y: 177 });
    }));

  });


  describe('undo support', function() {

    it('should undo', inject(function(elementRegistry, commandStack, modeling) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          authorityRequirementConn = knowledgeSource.incoming[0],
          requirement = elementRegistry.get('AuthorityRequirement_0jdv0hj'),
          businessObject = requirement.businessObject,
          edge = businessObject.di;

      var expectedWaypoints = [
        {
          original: { x: 200, y: 38 },
          x: 200, y: 38
        },
        {
          original: { x: 250, y: 150 },
          x: 250, y: 150
        },
        {
          original: { x: 545, y: 182 },
          x: 545, y: 182
        }
      ];

      // when
      modeling.layoutConnection(authorityRequirementConn);

      // then

      commandStack.undo();

      // expect cropped, repaired connection
      // that was not actually modified
      expect(authorityRequirementConn.waypoints).to.eql(expectedWaypoints);

      // expect cropped waypoints in di
      expect(pick(edge.waypoint[0], [ 'x', 'y' ])).eql({ x: 200, y: 38 });
      expect(pick(edge.waypoint[2], [ 'x', 'y' ])).eql({ x: 545, y: 182 });
    }));

  });


  describe('redo support', function() {

    it('should redo', inject(function(elementRegistry, commandStack, modeling) {

      // given
      var knowledgeSource = elementRegistry.get('host_ks'),
          authorityRequirementConn = knowledgeSource.incoming[0],
          requirement = elementRegistry.get('AuthorityRequirement_0jdv0hj'),
          businessObject = requirement.businessObject,
          edge = businessObject.di;

      var expectedWaypoints = [
        {
          original: { x: 200, y: 38 },
          x: 212, y: 65
        },
        {
          original: { x: 250, y: 150 },
          x: 250, y: 150
        },
        {
          original: { x: 545, y: 182 },
          x: 495, y: 177
        }
      ];

      // when
      modeling.layoutConnection(authorityRequirementConn);

      // then

      commandStack.undo();
      commandStack.redo();

      // expect cropped, repaired connection
      // that was not actually modified
      expect(authorityRequirementConn.waypoints).to.eql(expectedWaypoints);

      // expect cropped waypoints in di
      expect(pick(edge.waypoint[0], [ 'x', 'y' ])).eql({ x: 212, y: 65 });
      expect(pick(edge.waypoint[2], [ 'x', 'y' ])).eql({ x: 495, y: 177 });
    }));

  });

});
