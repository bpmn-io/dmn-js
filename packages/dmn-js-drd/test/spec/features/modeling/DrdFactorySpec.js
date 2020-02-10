import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';

import diagramXML from 'test/fixtures/dmn/simple-1-3.dmn';


describe('features/modeling - DrdFactory', function() {

  var testModules = [ modelingModule, coreModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('create element', function() {

    it('should return instance', inject(function(drdFactory) {

      // when
      var task = drdFactory.create('dmn:Decision');

      // then
      expect(task).to.exist;
      expect(task.$type).to.equal('dmn:Decision');
    }));


    it('should assign id for dmn:DecisionTable', inject(function(drdFactory) {

      // when
      var task = drdFactory.create('dmn:DecisionTable');

      // then
      expect(task.$type).to.equal('dmn:DecisionTable');
      expect(task.id).to.match(/^DecisionTable_/g);
    }));


    it('should assign id for dmn:InformationRequirement', inject(function(drdFactory) {

      // when
      var task = drdFactory.create('dmn:InformationRequirement');

      // then
      expect(task.$type).to.equal('dmn:InformationRequirement');
      expect(task.id).to.match(/^InformationRequirement/g);
    }));
  });


  describe('create di', function() {

    it('should create bounds', inject(function(drdFactory) {

      // given
      var bounds = {
        height: 100,
        width: 100,
        x: 100,
        y: 100
      };

      // when
      var result = drdFactory.createDiBounds(bounds);

      // then
      expect(result.$type).to.eql('dc:Bounds');

      expect(result).to.have.bounds(bounds);
    }));


    it('should create waypoints', inject(function(drdFactory) {

      // given
      var waypoints = [
        { original: { x: 0, y: 0 }, x: 0, y: 0 },
        { original: { x: 0, y: 0 }, x: 0, y: 0 }
      ];

      // when
      var result = drdFactory.createDiWaypoints(waypoints);

      // then
      expect(result).to.have.lengthOf(2);

      result.forEach(function(point, index) {
        expect(point.$type).to.eql('dc:Point');
        expect(point.x).to.eql(waypoints[index].x);
        expect(point.y).to.eql(waypoints[index].y);

        // expect original not to have been accidentally serialized
        expect(point.$attrs).to.eql({});
      });
    }));


    it('should create dmndi:DMNDiagram', inject(function(drdFactory) {

      // given
      var diagram = drdFactory.create('dmndi:DMNDiagram');

      // then
      expect(diagram.$type).to.eql('dmndi:DMNDiagram');

      expect(diagram).to.have.property('id');
    }));


    it('should create dmndi:DMNShape', inject(function(drdFactory) {

      // given
      var decision = drdFactory.create('dmn:Decision');
      var bounds = {
        height: 100,
        width: 100,
        x: 100,
        y: 100
      };

      // when
      var result = drdFactory.createDiShape(decision, bounds);

      // then
      expect(result.$type).to.eql('dmndi:DMNShape');
      expect(result.dmnElementRef).to.eql(decision);
      expect(result).to.have.bounds(bounds);
      expect(result).to.have.property('id');

      var shapeBounds = result.bounds;
      expect(shapeBounds.$type).to.eql('dc:Bounds');
    }));


    it('should create dmndi:DMNEdge', inject(function(drdFactory) {

      // given
      var informationRequirement = drdFactory.create('dmn:InformationRequirement');
      var waypoints = [
        { original: { x: 0, y: 0 }, x: 0, y: 0 },
        { original: { x: 0, y: 0 }, x: 0, y: 0 }
      ];

      // when
      var result = drdFactory.createDiEdge(informationRequirement, waypoints);

      // then
      expect(result.$type).to.eql('dmndi:DMNEdge');
      expect(result.dmnElementRef).to.eql(informationRequirement);
      expect(result).to.have.property('id');

      var edgeWaypoints = result.waypoint;
      expect(edgeWaypoints).to.exist;
      expect(edgeWaypoints).to.have.lengthOf(2);

      edgeWaypoints.forEach(function(point, index) {
        expect(point.$type).to.eql('dc:Point');
        expect(point.x).to.eql(waypoints[index].x);
        expect(point.y).to.eql(waypoints[index].y);

        // expect original not to have been accidentally serialized
        expect(point.$attrs).to.eql({});
      });
    }));
  });

});
