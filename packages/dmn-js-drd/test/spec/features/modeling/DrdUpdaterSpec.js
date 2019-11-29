/* global sinon */

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';

import { find } from 'min-dash';

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

    it('should update parent', inject(
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

    it('should update waypoints on move', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_1'),
            decision2 = elementRegistry.get('Decision_2');

        // when
        modeling.moveElements([ decision1, decision2 ], { x: 100, y: 100 });

        // then
        var decision2Bo = decision2.businessObject,
            edge = getEdge(decision2Bo);

        expect(edge.waypoints).to.have.lengthOf(2);
        expect(edge.waypoints[ 0 ]).to.include({ x: 347, y: 240 });
        expect(edge.waypoints[ 0 ].original).not.to.exist;
        expect(edge.waypoints[ 1 ]).to.include({ x: 347, y: 340 });
        expect(edge.waypoints[ 1 ].original).not.to.exist;
      }
    ));

  });


  describe('edges', function() {

    describe('move edge to new target on reconnect connection', function() {

      describe('decision', function() {

        var decision,
            decisionBo,
            edge;

        beforeEach(inject(function(elementRegistry, modeling) {

          // given
          decision = elementRegistry.get('Decision_2');

          decisionBo = decision.businessObject;

          edge = getEdge(decisionBo);

          var connection = decision.incoming[ 0 ];

          // when
          modeling.reconnect(
            connection,
            connection.source,
            elementRegistry.get('Decision_3'),
            getMid(elementRegistry.get('Decision_3'))
          );
        }));


        it('<do>', function() {

          // then
          expect(getEdge(decisionBo)).not.to.exist;
        });


        it('<undo>', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          expect(getEdge(decisionBo)).to.equal(edge);
        }));


        it('<redo>', inject(function(commandStack) {

          // given
          commandStack.undo();

          // when
          commandStack.redo();

          // then
          expect(getEdge(decisionBo)).not.to.exist;
        }));

      });


      it('should NOT move edge to text annotation', inject(
        function(elementRegistry, modeling) {

          // given
          var decision = elementRegistry.get('Decision_2'),
              decisionBo = decision.businessObject,
              textAnnotation = elementRegistry.get('TextAnnotation_1'),
              textAnnotationBo = textAnnotation.businessObject;

          var connection = decision.incoming[ 0 ];

          // when
          modeling.reconnect(
            connection,
            connection.source,
            textAnnotation,
            getMid(textAnnotation)
          );

          // then
          expect(getEdge(decisionBo)).to.not.exist;
          expect(getEdge(textAnnotationBo)).to.not.exist;
        })
      );

    });


    describe('remove edge from target on remove connection', function() {

      var decision,
          decisionBo,
          edge;

      beforeEach(inject(function(elementRegistry, modeling) {

        // given
        decision = elementRegistry.get('Decision_2');

        decisionBo = decision.businessObject;

        edge = getEdge(decisionBo);

        var connection = decision.incoming[ 0 ];

        // when
        modeling.removeConnection(connection);
      }));


      it('<do>', function() {

        // then
        expect(getEdge(decisionBo)).not.to.exist;
      });


      it('<undo>', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(getEdge(decisionBo)).to.equal(edge);
      }));


      it('<redo>', inject(function(commandStack) {

        // given
        commandStack.undo();

        // when
        commandStack.redo();

        // then
        expect(getEdge(decisionBo)).not.to.exist;
      }));

    });


    describe('update source on update properties', function() {

      var decision,
          edge;

      beforeEach(inject(function(elementRegistry, modeling) {

        // given
        decision = elementRegistry.get('Decision_1');

        edge = getEdge(elementRegistry.get('Decision_2').businessObject);

        // when
        modeling.updateProperties(decision, {
          id: 'foo'
        });
      }));


      it('<do>', function() {

        // then
        expect(edge.source).to.equal('foo');
      });


      it('<undo>', inject(function(commandStack) {

        // when
        commandStack.undo();

        // then
        expect(edge.source).to.equal('Decision_1');
      }));


      it('<redo>', inject(function(commandStack) {

        // given
        commandStack.undo();

        // when
        commandStack.redo();

        // then
        expect(edge.source).to.equal('foo');
      }));

    });

  });

});


// helpers //////////

function getBounds(businessObject) {
  var extensionElements = businessObject.extensionElements;

  return find(extensionElements.values, function(extensionElement) {
    return is(extensionElement, 'biodi:Bounds');
  });
}

function getEdge(businessObject) {
  var extensionElements = businessObject.extensionElements;

  return find(extensionElements.values, function(extensionElement) {
    return is(extensionElement, 'biodi:Edge');
  });
}