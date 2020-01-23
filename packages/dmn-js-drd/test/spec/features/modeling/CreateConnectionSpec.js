import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';


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
        informationRequirementConnection,
        informationRequirement,
        waypoints,
        diWaypoints,
        requiredInput;


    // when
    informationRequirementConnection = modeling.connect(inputShape, decisionShape);

    informationRequirement = informationRequirementConnection.businessObject;

    waypoints = informationRequirementConnection.waypoints;
    diWaypoints = informationRequirement.di.waypoint;

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

    // di
    expect(informationRequirement.di.$parent).to.eql(rootElement.businessObject.di);

    expect(waypoints[0].x).to.eql(diWaypoints[0].x);
    expect(waypoints[0].y).to.eql(diWaypoints[0].y);

    expect(waypoints[1].x).to.eql(diWaypoints[1].x);
    expect(waypoints[1].y).to.eql(diWaypoints[1].y);
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
    expect(informationRequirement.di.$parent).to.be.null;
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
    expect(informationRequirement.di.$parent).to.eql(rootElement.businessObject.di);
  }));


  it('should use the provided connection type', inject(
    function(canvas, elementRegistry, commandStack, modeling) {

      // given
      var rootElement = canvas.getRootElement(),
          inputShape = elementRegistry.get('inputData_1'),
          decisionShape = elementRegistry.get('decision_1'),
          connection;

      // when
      connection = modeling.createConnection(inputShape, decisionShape, {
        type: 'dmn:InformationRequirement'
      }, rootElement);

      // then
      expect(connection.type).to.equal('dmn:InformationRequirement');
    }
  ));


  it('should not contain source and target business object in waypoint data', inject(
    function(canvas, elementRegistry, commandStack, modeling) {

      // given
      var rootElement = canvas.getRootElement(),
          inputShape = elementRegistry.get('inputData_1'),
          decisionShape = elementRegistry.get('decision_1'),
          waypoints;

      // when
      var connection = modeling.createConnection(inputShape, decisionShape, {
        type: 'dmn:InformationRequirement'
      }, rootElement);

      waypoints = connection.businessObject.di.waypoint;

      // then
      expect(waypoints[0].$attrs.type).to.be.undefined;
      expect(waypoints[1].$attrs.type).to.be.undefined;
    }
  ));


  describe('Annotations', function() {

    it('should create an association', inject(
      function(canvas, elementRegistry, modeling) {

        // given
        var rootElement = canvas.getRootElement(),
            source = elementRegistry.get('inputData_1'),
            target = elementRegistry.get('annotation_1'),
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

        waypoints = connectionBO.di.waypoint;

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
        expect(rootElement.businessObject.get('artifact')).to.include(connectionBO);

        expect(waypoints[0].x).to.eql(connection.waypoints[0].x);
        expect(waypoints[0].y).to.eql(connection.waypoints[0].y);
        expect(waypoints[1].x).to.eql(connection.waypoints[1].x);
        expect(waypoints[1].y).to.eql(connection.waypoints[1].y);
      }
    ));


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
      expect(rootElement.businessObject.get('artifact')).to.not.include(connectionBO);
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
      expect(rootElementBO.get('artifact')).to.include(connectionBO);
    }));

  });

  describe('append', function() {

    it('should connect input data to decision', inject(
      function(canvas, elementFactory, elementRegistry, modeling) {

        // given
        var inputData = elementRegistry.get('inputData_1'),
            decision = elementFactory.createShape({ type: 'dmn:Decision' }),
            rootElement = canvas.getRootElement();

        // when
        modeling.appendShape(inputData, decision, { x: 100, y: 100 }, rootElement);

        // then
        expect(inputData.outgoing).to.have.lengthOf(1);
        expect(decision.incoming).to.have.lengthOf(1);

        var connection = inputData.outgoing[0];

        expect(connection.type).to.equal('dmn:InformationRequirement');
        expect(connection.source).to.equal(inputData);
        expect(connection.target).to.equal(decision);

        var edge = connection.businessObject.di;

        expect(edge).to.exist;
      })
    );

  });


  describe('connection types', function() {

    it('should connect decision to knowledge source', inject(
      function(canvas, elementRegistry, commandStack, modeling) {

        // given
        var source = elementRegistry.get('decision_1'),
            target = elementRegistry.get('host_ks'),
            connection;

        // when
        connection = modeling.connect(source, target);

        // then
        expect(connection.type).to.eql('dmn:AuthorityRequirement');
      }
    ));


    it('should connect business knowledge model to decision', inject(
      function(elementRegistry, modeling) {

        // given
        var source = elementRegistry.get('elMenu'),
            target = elementRegistry.get('decision_1'),
            connection;

        // when
        connection = modeling.connect(source, target);

        // then
        expect(connection.type).to.eql('dmn:KnowledgeRequirement');
      }
    ));


    it('should connect knowledge source to decision', inject(
      function(elementRegistry, modeling) {

        // given
        var source = elementRegistry.get('host_ks'),
            target = elementRegistry.get('decision_1'),
            connection;

        // when
        connection = modeling.connect(source, target);

        // then
        expect(connection.type).to.eql('dmn:AuthorityRequirement');
      }
    ));


    it('should connect knowledge source to business knowlege model', inject(
      function(elementRegistry, modeling) {

        // given
        var source = elementRegistry.get('host_ks'),
            target = elementRegistry.get('elMenu'),
            connection;

        // when
        connection = modeling.connect(source, target);

        // then
        expect(connection.type).to.eql('dmn:AuthorityRequirement');
      }
    ));


    it('should connect input data to decision', inject(
      function(elementRegistry, modeling) {

        // given
        var source = elementRegistry.get('inputData_1'),
            target = elementRegistry.get('decision_1'),
            connection;

        // when
        connection = modeling.connect(source, target);

        // then
        expect(connection.type).to.eql('dmn:InformationRequirement');
      }
    ));


    it('should connect input data to knowledge source', inject(
      function(elementRegistry, modeling) {

        // given
        var source = elementRegistry.get('inputData_1'),
            target = elementRegistry.get('host_ks'),
            connection;

        // when
        connection = modeling.connect(source, target);

        // then
        expect(connection.type).to.eql('dmn:AuthorityRequirement');
      }
    ));


    it('should connect input data to text annotation', inject(
      function(elementRegistry, modeling) {

        // given
        var source = elementRegistry.get('inputData_1'),
            target = elementRegistry.get('annotation_1'),
            connection;

        // when
        connection = modeling.connect(source, target);

        // then
        expect(connection.type).to.eql('dmn:Association');
      }
    ));

  });

});
