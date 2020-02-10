/* global sinon */

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';

var restore = sinon.restore;


describe('features/modeling - DrdUpdater', function() {

  var testModules = [ coreModule, modelingModule ];

  var diagramXML = require('./drd-updater.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  afterEach(restore);


  describe('crop connection', function() {

    it('should crop connection once', inject(
      function(connectionDocking, elementRegistry, modeling) {

        // given
        var source = elementRegistry.get('Decision_1'),
            connection = source.outgoing[0],
            target = elementRegistry.get('Decision_3'),
            getCroppedWaypointsSpy = sinon.spy(connectionDocking, 'getCroppedWaypoints');

        // when
        modeling.reconnectEnd(connection, target, getMid(target));

        // then
        expect(getCroppedWaypointsSpy.withArgs(connection)).to.have.been.calledOnce;
      }
    ));

  });


  describe('update parent', function() {

    it('should update parent when decision is created', inject(
      function(elementFactory, elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject;

        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        // when
        modeling.createShape(decision, { x: 100, y: 100 }, definitions);

        // then
        var decisionBo = decision.businessObject;

        expect(decisionBo.$parent).to.equal(definitionsBo);
        expect(definitionsBo.drgElement).to.include(decisionBo);
      }
    ));


    it('should update parent when decision is removed', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject,
            decision = elementRegistry.get('Decision_3'),
            decisionBo = decision.businessObject;

        // when
        modeling.removeShape(decision);

        // then
        expect(decisionBo.$parent).to.be.null;
        expect(definitionsBo.drgElement).to.not.include(decisionBo);
      }
    ));


    it('should update parent when text annotation is created', inject(
      function(elementFactory, elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject;

        var textAnnotation = elementFactory.create(
          'shape', { type: 'dmn:TextAnnotation' }
        );

        // when
        modeling.createShape(textAnnotation, { x: 100, y: 100 }, definitions);

        // then
        var textAnnotationBo = textAnnotation.businessObject;

        expect(textAnnotationBo.$parent).to.eql(definitionsBo);
        expect(definitionsBo.get('artifact')).to.include(textAnnotationBo);
      }
    ));


    it('should update parent when text annotation is removed', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject,
            textAnnotation = elementRegistry.get('TextAnnotation_1');

        // when
        modeling.removeShape(textAnnotation);

        // then
        var textAnnotationBo = textAnnotation.businessObject;

        expect(textAnnotationBo.$parent).to.be.null;
        expect(definitionsBo.get('artifact')).to.not.include(textAnnotationBo);
      }
    ));


    it('should update parent when information requirement is created', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_2'),
            decision2 = elementRegistry.get('Decision_3');

        // when
        var informationRequirement = modeling.connect(decision1, decision2),
            informationRequirementBo = informationRequirement.businessObject;

        // then
        expect(informationRequirementBo.$parent).to.eql(decision2.businessObject);
      }
    ));


    it('should update parent when information requirement is removed', inject(
      function(elementRegistry, modeling) {

        // given
        var informationRequirement = elementRegistry.get('InformationRequirement_1'),
            informationRequirementBo = informationRequirement.businessObject;

        // when
        modeling.removeConnection(informationRequirement);

        // then
        expect(informationRequirementBo.$parent).to.be.null;
      }
    ));


    it('should update parent when association is created', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject,
            textAnnotation = elementRegistry.get('TextAnnotation_1'),
            decision = elementRegistry.get('Decision_3');

        // when
        var association = modeling.connect(textAnnotation, decision),
            associationBo = association.businessObject;

        // then
        expect(associationBo.$parent).to.eql(definitionsBo);
        expect(definitionsBo.get('artifact')).to.include(associationBo);
      }
    ));


    it('should update parent when association is removed', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject,
            association = elementRegistry.get('Association_1'),
            associationBo = association.businessObject;

        // when
        modeling.removeConnection(association);

        // then
        expect(associationBo.$parent).to.be.null;
        expect(definitionsBo.get('artifact')).to.not.include(associationBo);
      }
    ));

  });


  describe('update di parent', function() {

    it('should update di parent when decision is created', inject(
      function(elementFactory, elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            diagram = definitions.businessObject.dmnDI.diagrams[0];

        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        // when
        modeling.createShape(decision, { x: 100, y: 100 }, definitions);

        // then
        var di = decision.businessObject.di;

        expect(di.$parent).to.equal(diagram);
        expect(diagram.get('diagramElements')).to.include(di);
      }
    ));


    it('should update di parent when decision is removed', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            decision = elementRegistry.get('Decision_3'),
            diagram = definitions.businessObject.dmnDI.diagrams[0];


        // when
        modeling.removeShape(decision);

        // then
        var di = decision.businessObject.di;

        expect(di.$parent).to.be.null;
        expect(diagram.get('diagramElements')).to.not.include(di);
      }
    ));


    it('should update di parent when text annotation is created', inject(
      function(elementFactory, elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject,
            diagram = definitionsBo.dmnDI.diagrams[0];

        var textAnnotation = elementFactory.create(
          'shape', { type: 'dmn:TextAnnotation' }
        );

        // when
        modeling.createShape(textAnnotation, { x: 100, y: 100 }, definitions);

        // then
        var di = textAnnotation.businessObject.di;

        expect(di.$parent).to.eql(diagram);
        expect(diagram.get('diagramElements')).to.include(di);
      }
    ));


    it('should update di parent when text annotation is removed', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            definitionsBo = definitions.businessObject,
            diagram = definitionsBo.dmnDI.diagrams[0],
            textAnnotation = elementRegistry.get('TextAnnotation_1');

        // when
        modeling.removeShape(textAnnotation);

        // then
        var di = textAnnotation.businessObject.di;

        expect(di.$parent).to.be.null;
        expect(diagram.get('diagramElements')).to.not.include(di);
      }
    ));


    it('should update di parent when information requirement is added', inject(
      function(elementFactory, elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            diagram = definitions.businessObject.dmnDI.diagrams[0];

        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        // when
        modeling.createShape(decision, { x: 100, y: 100 }, definitions);

        // then
        var di = decision.businessObject.di;

        expect(di.$parent).to.equal(diagram);
        expect(diagram.get('diagramElements')).to.include(di);
      }
    ));


    it('should update di parent when information requirement is removed', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            informationRequirement = elementRegistry.get('InformationRequirement_1'),
            diagram = definitions.businessObject.dmnDI.diagrams[0];


        // when
        modeling.removeShape(informationRequirement);

        // then
        var di = informationRequirement.businessObject.di;

        expect(di.$parent).to.be.null;
        expect(diagram.get('diagramElements')).to.not.include(di);
      }
    ));


    it('should update di parent when association is created', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            diagram = definitions.businessObject.dmnDI.diagrams[0],
            textAnnotation = elementRegistry.get('TextAnnotation_1'),
            decision = elementRegistry.get('Decision_3');

        // when
        var association = modeling.connect(textAnnotation, decision);

        // then
        var di = association.businessObject.di;

        expect(di.$parent).to.eql(diagram);
        expect(diagram.get('diagramElements')).to.include(di);
      }
    ));


    it('should update di parent when association is removed', inject(
      function(elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1'),
            diagram = definitions.businessObject.dmnDI.diagrams[0],
            association = elementRegistry.get('Association_1');

        // when
        modeling.removeConnection(association);

        // then
        var di = association.businessObject.di;

        expect(di.$parent).to.be.null;
        expect(diagram.get('diagramElements')).to.not.include(di);
      }
    ));

  });


  describe('update bounds', function() {

    it('should update bounds on create', inject(
      function(elementFactory, elementRegistry, modeling) {

        // given
        var definitions = elementRegistry.get('Definitions_1');

        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        // when
        modeling.createShape(decision, { x: 100, y: 100 }, definitions);

        // then
        var decisionBo = decision.businessObject,
            bounds = getBounds(decisionBo);

        expect(bounds).to.include({
          x: 10,
          y: 60,
          width: 180,
          height: 80
        });
      }
    ));


    it('should update bounds on move', inject(
      function(elementRegistry, modeling) {

        // given
        var decision = elementRegistry.get('Decision_1');

        // when
        modeling.moveShape(decision, { x: 100, y: 100 });

        // then
        var decisionBo = decision.businessObject,
            bounds = getBounds(decisionBo);

        expect(bounds).to.include({
          x: 257,
          y: 200,
          width: 180,
          height: 80
        });
      }
    ));

  });


  describe('update waypoints', function() {

    it('should update waypoint on connect', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_2'),
            decision2 = elementRegistry.get('Decision_3');

        // when
        var connection = modeling.connect(decision1, decision2);

        // then
        var edge = getEdge(connection);

        expect(edge.waypoint).to.have.lengthOf(2);
        expect(edge.waypoint[ 0 ]).to.include({ x: 247, y: 280 });
        expect(edge.waypoint[ 0 ].original).not.to.exist;
        expect(edge.waypoint[ 1 ]).to.include({ x: 247, y: 300 });
        expect(edge.waypoint[ 1 ].original).not.to.exist;
      }
    ));

    it('should update waypoints on move', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_1'),
            decision2 = elementRegistry.get('Decision_2'),
            informationRequirement = elementRegistry.get('InformationRequirement_1');

        // when
        modeling.moveElements([ decision1, decision2 ], { x: 100, y: 100 });

        // then
        var edge = getEdge(informationRequirement);

        expect(edge.waypoint).to.have.lengthOf(2);
        expect(edge.waypoint[ 0 ]).to.include({ x: 347, y: 240 });
        expect(edge.waypoint[ 0 ].original).not.to.exist;
        expect(edge.waypoint[ 1 ]).to.include({ x: 347, y: 340 });
        expect(edge.waypoint[ 1 ].original).not.to.exist;
      }
    ));

  });
});


// helpers //////////

function getBounds(businessObject) {
  return businessObject.di.bounds;
}

function getEdge(connection) {
  return connection.businessObject.di;
}
