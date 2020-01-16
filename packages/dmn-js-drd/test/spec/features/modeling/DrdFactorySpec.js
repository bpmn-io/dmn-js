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

      var task = drdFactory.create('dmn:Decision');
      expect(task).to.exist;
      expect(task.$type).to.equal('dmn:Decision');
    }));


    it('should assign id for dmn:DecisionTable', inject(function(drdFactory) {
      var task = drdFactory.create('dmn:DecisionTable');

      expect(task.$type).to.equal('dmn:DecisionTable');
      expect(task.id).to.match(/^DecisionTable_/g);
    }));


    it('should assign id for dmn:InformationRequirement', inject(function(drdFactory) {
      var task = drdFactory.create('dmn:InformationRequirement');

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

      expect(result.x).to.eql(bounds.x);
      expect(result.y).to.eql(bounds.y);
      expect(result.height).to.eql(bounds.height);
      expect(result.width).to.eql(bounds.width);
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

      var shapeBounds = result.bounds;
      expect(shapeBounds).to.exist;
      expect(shapeBounds.$type).to.eql('dc:Bounds');
      expect(shapeBounds.x).to.eql(bounds.x);
      expect(shapeBounds.y).to.eql(bounds.y);
      expect(shapeBounds.height).to.eql(bounds.height);
      expect(shapeBounds.width).to.eql(bounds.width);
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
