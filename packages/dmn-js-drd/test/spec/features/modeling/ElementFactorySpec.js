import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';

import { forEach } from 'min-dash';


describe('features/modeling - create elements', function() {

  var testModules = [ coreModule, modelingModule ];

  var emptyDefsXML = require('./ElementFactory.dmn');

  beforeEach(bootstrapModeler(emptyDefsXML, { modules: testModules }));


  function expectShape(element, attrs) {
    var businessObject = element.businessObject,
        di = businessObject.di;

    expect(element.type).to.equal(attrs.type);

    expect(businessObject).to.equal(attrs.businessObject);
    expect(businessObject.$parent).to.exist;
    expect(di).to.exist;

    var bounds = di.bounds;
    expect(bounds).to.exist;
    expect(bounds).to.have.bounds({
      x: element.x,
      y: element.y,
      width: attrs.width,
      height: attrs.height
    });

    expect(element.width).to.equal(attrs.width);
    expect(element.height).to.equal(attrs.height);
  }

  function expectEdge(element, attrs) {
    var businessObject = element.businessObject,
        di = businessObject.di;

    expect(element.type).to.equal(attrs.type);

    expect(businessObject).to.equal(attrs.businessObject);
    expect(businessObject.$parent).to.exist;
    expect(di).to.exist;


    var waypoints = di.waypoint;
    forEach(waypoints, function(waypoint, index) {
      expect(waypoint.x).to.eql(attrs.waypoints[index].x);
      expect(waypoint.y).to.eql(attrs.waypoints[index].y);

      expect(waypoint.x).to.eql(element.waypoints[index].x);
      expect(waypoint.y).to.eql(element.waypoints[index].y);
    });
  }


  describe('basics', function() {

    it('should create dmndi:DMNShape if missing', inject(function(elementFactory) {

      // when
      var decision = elementFactory.createShape({
        type: 'dmn:Decision'
      });

      // then
      var businessObject = decision.businessObject;
      expect(businessObject).to.exist;

      var di = businessObject.di;
      expect(di).to.exist;
      expect(di.$type).to.eql('dmndi:DMNShape');
      expect(di.id).to.match(/DMNShape_/);
    }));


    it('should create dmndi:DMNEdge if missing', inject(function(elementFactory) {

      // when
      var informationRequirement = elementFactory.createConnection({
        type: 'dmn:InformationRequirement'
      });

      // then
      var businessObject = informationRequirement.businessObject;
      expect(businessObject).to.exist;

      var di = businessObject.di;
      expect(di).to.exist;
      expect(di.$type).to.eql('dmndi:DMNEdge');
      expect(di.id).to.match(/DMNEdge_/);
    }));
  });


  describe('shapes', function() {

    it('should create a decision', inject(
      function(canvas, drdFactory, elementFactory, modeling) {

        // given
        var rootElement = canvas.getRootElement(),
            businessObject = drdFactory.create('dmn:Decision', {
              name: 'Season'
            }),
            decision = elementFactory.createShape({
              type: 'dmn:Decision',
              businessObject: businessObject
            });

        // when
        modeling.createShape(decision, { x: 100, y: 100 }, rootElement);

        // then
        expectShape(decision, {
          type: 'dmn:Decision',
          width: 180,
          height: 80,
          businessObject: businessObject
        });
      }
    ));


    it('should create an input data', inject(
      function(canvas, drdFactory, elementFactory, modeling) {

        // given
        var rootElement = canvas.getRootElement(),
            businessObject = drdFactory.create('dmn:InputData', {
              name: 'Guests'
            }),
            inputData = elementFactory.createShape({
              type: 'dmn:InputData',
              businessObject: businessObject
            });

        // when
        modeling.createShape(inputData, { x: 100, y: 100 }, rootElement);

        // then
        expectShape(inputData, {
          type: 'dmn:InputData',
          width: 125,
          height: 45,
          businessObject: businessObject
        });
      }
    ));


    it('should create a knowledge source', inject(
      function(canvas, drdFactory, elementFactory, modeling) {

        // given
        var rootElement = canvas.getRootElement(),
            businessObject = drdFactory.create('dmn:KnowledgeSource', {
              name: 'How to?'
            }),
            knowledgeSource = elementFactory.createShape({
              type: 'dmn:KnowledgeSource',
              businessObject: businessObject
            });

        // when
        modeling.createShape(knowledgeSource, { x: 100, y: 100 }, rootElement);

        // then
        expectShape(knowledgeSource, {
          type: 'dmn:KnowledgeSource',
          width: 100,
          height: 63,
          businessObject: businessObject
        });
      }
    ));


    it('should create a business knowledge model', inject(
      function(canvas, drdFactory, elementFactory, modeling) {

        // given
        var rootElement = canvas.getRootElement(),
            businessObject = drdFactory.create('dmn:BusinessKnowledgeModel', {
              name: 'Plates'
            }),
            businessKnowledgeModel = elementFactory.createShape({
              type: 'dmn:BusinessKnowledgeModel',
              businessObject: businessObject
            });

        // when
        modeling.createShape(
          businessKnowledgeModel,
          { x: 100, y: 100 },
          rootElement
        );

        // then
        expectShape(businessKnowledgeModel, {
          type: 'dmn:BusinessKnowledgeModel',
          width: 135,
          height: 46,
          businessObject: businessObject
        });

      }
    ));


    it('should create a TextAnnotation', inject(
      function(canvas, drdFactory, elementFactory, modeling) {

        // given
        var rootElement = canvas.getRootElement(),
            businessObject = drdFactory.create('dmn:TextAnnotation', {
              text: 'Plates'
            }),
            textAnnotation = elementFactory.createShape({
              type: 'dmn:TextAnnotation',
              businessObject: businessObject
            });

        // when
        modeling.createShape(textAnnotation, { x: 100, y: 100 }, rootElement);

        // then
        expectShape(textAnnotation, {
          type: 'dmn:TextAnnotation',
          width: 100,
          height: 80,
          businessObject: businessObject
        });
      }
    ));
  });


  describe('edges', function() {

    var decision, input;

    beforeEach(inject(function(canvas, drdFactory, elementFactory, modeling) {
      var rootElement = canvas.getRootElement();

      decision = elementFactory.createShape({
        type: 'dmn:Decision',
        businessObject: drdFactory.create('dmn:Decision', {
          text: 'Plates'
        })
      });
      modeling.createShape(decision, { x: 100, y: 100 }, rootElement);

      input = elementFactory.createShape({
        type: 'dmn:InputData',
        businessObject: drdFactory.create('dmn:InputData', {
          name: 'Guests'
        })
      });
      modeling.createShape(input, { x: 300, y: 100 }, rootElement);
    }));


    it('should create an information requirement', inject(
      function(canvas, drdFactory, elementFactory, modeling) {

        // given
        var rootElement = canvas.getRootElement(),
            businessObject = drdFactory.create('dmn:InformationRequirement', {
              name: 'Season'
            }),
            informationRequirement = elementFactory.createConnection({
              type: 'dmn:InformationRequirement',
              businessObject: businessObject
            }, []);

        // when
        modeling.createConnection(input, decision, informationRequirement, rootElement);

        // then
        expectEdge(informationRequirement, {
          type: 'dmn:InformationRequirement',
          businessObject: businessObject,
          waypoints: [
            { x: 237, y: 100 },
            { x: 190, y: 100 }
          ]
        });
      }
    ));
  });

});
