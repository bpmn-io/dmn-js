'use strict';

require('../../TestHelper');

var LayoutUtil = require('diagram-js/lib/layout/LayoutUtil');

var getMid = LayoutUtil.getMid;

/* global bootstrapModeler, inject */
function expectWaypoint(waypoint, element) {
  var midPoint = getMid(element);

  expect(waypoint.x).to.eql(midPoint.x);
  expect(waypoint.y).to.eql(midPoint.y);
}

var modelingModule = require('../../../../lib/features/modeling'),
    coreModule = require('../../../../lib/core');


describe('features/modeling - create connection', function() {

  var diagramXML = require('../../../fixtures/dmn/connections.dmn');

  var testModules = [ coreModule, modelingModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should connect', inject(function(canvas, modeling, elementRegistry) {

    // given
    var rootElement = canvas.getRootElement(),
        inputShape = elementRegistry.get('inputData_1'),
        input = inputShape.businessObject,
        decisionShape = elementRegistry.get('decision_1'),
        decision = decisionShape.businessObject,
        decisionExtensionElements = decision.extensionElements.values,
        informationRequirementConnection,
        informationRequirement,
        waypoints,
        requiredInput;


    // when
    informationRequirementConnection = modeling.connect(inputShape, decisionShape);

    informationRequirement = informationRequirementConnection.businessObject;

    waypoints = decisionExtensionElements[1].waypoints;

    requiredInput = informationRequirement.requiredInput;

    // then
    expect(informationRequirementConnection).to.exist;
    expect(informationRequirement).to.exist;

    expect(informationRequirementConnection.type).to.equal('dmn:InformationRequirement');

    expect(requiredInput).to.exist;
    expect(requiredInput.href).to.equal('#' + input.id);

    expect(informationRequirement.$parent).to.eql(decision);
    expect(informationRequirementConnection.parent).to.eql(rootElement);

    expect(decision.informationRequirement).to.include(informationRequirement);
    expect(rootElement.children).to.include(informationRequirementConnection);

    expect(waypoints[0].x).to.eql(decisionExtensionElements[1].waypoints[0].x);
    expect(waypoints[0].y).to.eql(decisionExtensionElements[1].waypoints[0].y);

    expect(waypoints[1].x).to.eql(decisionExtensionElements[1].waypoints[1].x);
    expect(waypoints[1].y).to.eql(decisionExtensionElements[1].waypoints[1].y);
  }));


  it('should undo', inject(function(canvas, elementRegistry, commandStack, modeling) {
    // given
    var rootElement = canvas.getRootElement(),
        inputShape = elementRegistry.get('inputData_1'),
        decisionShape = elementRegistry.get('decision_1'),
        decision = decisionShape.businessObject,
        informationRequirementConnection,
        informationRequirement;

    // when
    informationRequirementConnection = modeling.connect(inputShape, decisionShape);

    informationRequirement = informationRequirementConnection.businessObject;

    // when
    commandStack.undo();

    // then
    expect(informationRequirement.$parent).to.be.null;
    expect(informationRequirementConnection.parent).to.be.null;

    expect(decision.informationRequirement).to.not.include(informationRequirement);
    expect(rootElement.children).to.not.include(informationRequirementConnection);

    // di
    expect(decision.extensionElements.values.length).to.eql(1);
  }));


  it('should redo', inject(function(canvas, elementRegistry, commandStack, modeling) {

    // given
    var rootElement = canvas.getRootElement(),
        inputShape = elementRegistry.get('inputData_1'),
        decisionShape = elementRegistry.get('decision_1'),
        decision = decisionShape.businessObject,
        informationRequirementConnection,
        informationRequirement;

    // when
    informationRequirementConnection = modeling.connect(inputShape, decisionShape);

    informationRequirement = informationRequirementConnection.businessObject;

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    expect(informationRequirement.$parent).to.eql(decision);
    expect(informationRequirementConnection.parent).to.eql(rootElement);

    expect(decision.informationRequirement).to.include(informationRequirement);
    expect(rootElement.children).to.include(informationRequirementConnection);

    // di
    expect(decision.extensionElements.values.length).to.eql(2);
  }));


  it('should use the provided connection type', inject(function(canvas, elementRegistry, commandStack, modeling) {

    // given
    var rootElement = canvas.getRootElement(),
        inputShape = elementRegistry.get('inputData_1'),
        decisionShape = elementRegistry.get('decision_1'),
        informationRequirementConnection;

    // when
    informationRequirementConnection = modeling.createConnection(inputShape, decisionShape, {
      type: 'dmn:InformationRequirement'
    }, rootElement);

    // then
    expect(informationRequirementConnection.type).to.equal('dmn:InformationRequirement');
  }));


  it('should not contain source and target business object in waypoint data', inject(function(canvas, elementRegistry, commandStack, modeling) {
    // given
    var rootElement = canvas.getRootElement(),
        inputShape = elementRegistry.get('inputData_1'),
        decisionShape = elementRegistry.get('decision_1'),
        waypoints;

    // when
    modeling.createConnection(inputShape, decisionShape, {
      type: 'dmn:InformationRequirement'
    }, rootElement);

    waypoints = decisionShape.businessObject.extensionElements.values[1].waypoints;

    // then
    expect(waypoints[0].$attrs.type).to.be.undefined;
    expect(waypoints[1].$attrs.type).to.be.undefined;
  }));


  describe('Annotations', function() {

    it('should create an association', inject(function(canvas, elementRegistry, modeling) {
      // given
      var rootElement = canvas.getRootElement(),
          source = elementRegistry.get('inputData_1'),
          target = elementRegistry.get('annotation_1'),
          sourceBounds = source.businessObject.extensionElements.values[0],
          targetBounds = target.businessObject.extensionElements.values[0],
          connection,
          connectionBO,
          sourceRef,
          targetRef,
          waypoints;

      // when
      connection = modeling.connect(source, target);

      connectionBO = connection.businessObject;

      sourceRef = connectionBO.sourceRef;
      targetRef = connectionBO.targetRef;

      waypoints = connectionBO.extensionElements.values[0].waypoints;

      // then
      expect(connection).to.exist;
      expect(connectionBO).to.exist;

      expect(connection.type).to.equal('dmn:Association');

      expect(sourceRef).to.exist;
      expect(sourceRef.href).to.equal('#' + source.id);
      expect(targetRef).to.exist;
      expect(targetRef.href).to.equal('#' + target.id);

      expect(connection.parent).to.eql(rootElement);
      expect(connectionBO.$parent).to.eql(rootElement.businessObject);

      expect(rootElement.children).to.include(connection);
      expect(rootElement.businessObject.artifacts).to.include(connectionBO);

      expectWaypoint(waypoints[0], sourceBounds);
      expectWaypoint(waypoints[1], targetBounds);
    }));


    it('should undo', inject(function(canvas, elementRegistry, commandStack, modeling) {
      // given
      var rootElement = canvas.getRootElement(),
          source = elementRegistry.get('inputData_1'),
          target = elementRegistry.get('annotation_1'),
          connection = modeling.connect(source, target),
          connectionBO = connection.businessObject;

      // when
      commandStack.undo();

      // then
      expect(connection.parent).to.be.null;
      expect(connectionBO.$parent).to.be.null;

      expect(rootElement.children).to.not.include(connection);
      expect(rootElement.businessObject.artifacts).to.not.include(connectionBO);
    }));


    it('should redo', inject(function(canvas, elementRegistry, commandStack, modeling) {
      // given
      var rootElement = canvas.getRootElement(),
          rootElementBO = rootElement.businessObject,
          source = elementRegistry.get('inputData_1'),
          target = elementRegistry.get('annotation_1'),
          connection = modeling.connect(source, target),
          connectionBO = connection.businessObject;

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(connection.parent).to.eql(rootElement);
      expect(connectionBO.$parent).to.eql(rootElementBO);

      expect(rootElement.children).to.include(connection);
      expect(rootElementBO.artifacts).to.include(connectionBO);
    }));

  });

  describe('append', function() {


    it('should connect decision to knowledge source', inject(function(canvas, elementRegistry, elementFactory, modeling) {
      // given
      var decision = elementRegistry.get('decision_1'),
          inputData = elementFactory.createShape({ type: 'dmn:InputData' }),
          rootElement = canvas.getRootElement(),
          connection;

      // when
      modeling.appendShape(decision, inputData, { x: 100, y: 300 }, rootElement);

      connection = decision.incoming[0];

      // then
      expect(connection.type).to.eql('dmn:InformationRequirement');
      expect(inputData.outgoing[0].type).to.eql('dmn:InformationRequirement');
      expect(decision.businessObject.extensionElements.values[1].source).to.equal(inputData.id);
    }));

  });

  describe('connection types', function() {

    it('should connect decision to knowledge source', inject(function(canvas, elementRegistry, commandStack, modeling) {
      // given
      var source = elementRegistry.get('decision_1'),
          target = elementRegistry.get('host_ks'),
          connection;

      // when
      connection = modeling.connect(source, target);

      // then
      expect(connection.type).to.eql('dmn:AuthorityRequirement');
    }));


    it('should connect business knowledge model to decision', inject(function(elementRegistry, modeling) {
      // given
      var source = elementRegistry.get('elMenu'),
          target = elementRegistry.get('decision_1'),
          connection;

      // when
      connection = modeling.connect(source, target);

      // then
      expect(connection.type).to.eql('dmn:KnowledgeRequirement');
    }));


    it('should connect knowledge source to decision', inject(function(elementRegistry, modeling) {
      // given
      var source = elementRegistry.get('host_ks'),
          target = elementRegistry.get('decision_1'),
          connection;

      // when
      connection = modeling.connect(source, target);

      // then
      expect(connection.type).to.eql('dmn:AuthorityRequirement');
    }));


    it('should connect knowledge source to business knowlege model', inject(function(elementRegistry, modeling) {
      // given
      var source = elementRegistry.get('host_ks'),
          target = elementRegistry.get('elMenu'),
          connection;

      // when
      connection = modeling.connect(source, target);

      // then
      expect(connection.type).to.eql('dmn:AuthorityRequirement');
    }));


    it('should connect input data to decision', inject(function(elementRegistry, modeling) {
      // given
      var source = elementRegistry.get('inputData_1'),
          target = elementRegistry.get('decision_1'),
          connection;

      // when
      connection = modeling.connect(source, target);

      // then
      expect(connection.type).to.eql('dmn:InformationRequirement');
    }));


    it('should connect input data to knowledge source', inject(function(elementRegistry, modeling) {
      // given
      var source = elementRegistry.get('inputData_1'),
          target = elementRegistry.get('host_ks'),
          connection;

      // when
      connection = modeling.connect(source, target);

      // then
      expect(connection.type).to.eql('dmn:AuthorityRequirement');
    }));


    it('should connect input data to text annotation', inject(function(elementRegistry, modeling) {
      // given
      var source = elementRegistry.get('inputData_1'),
          target = elementRegistry.get('annotation_1'),
          connection;

      // when
      connection = modeling.connect(source, target);

      // then
      expect(connection.type).to.eql('dmn:Association');
    }));

  });

});
