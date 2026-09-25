import * as sinon from 'sinon';
import { expect } from 'chai';

import {
  bootstrapModeler,
  inject,
  injectAsync
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


    describe('connections', function() {

      describe('information requirement', function() {

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

      });


      describe('association', function() {

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


        describe('should not update parent when association is reconnected', function() {

          it('<do>', inject(
            function(elementRegistry, modeling) {

              // given
              var definitions = elementRegistry.get('Definitions_1'),
                  definitionsBo = definitions.businessObject,
                  association = elementRegistry.get('Association_1'),
                  decision = elementRegistry.get('Decision_2'),
                  associationBo = association.businessObject;

              // when
              modeling.reconnectStart(association, decision, getMid(decision));

              // then
              expect(associationBo.$parent).to.eql(definitionsBo);
              expect(definitionsBo.get('artifact')).to.include(associationBo);
            }
          ));


          it('<undo>', inject(
            function(commandStack, elementRegistry, modeling) {

              // given
              var definitions = elementRegistry.get('Definitions_1'),
                  definitionsBo = definitions.businessObject,
                  association = elementRegistry.get('Association_1'),
                  decision = elementRegistry.get('Decision_2'),
                  associationBo = association.businessObject;

              modeling.reconnectStart(association, decision, getMid(decision));

              // when
              commandStack.undo();

              // then
              expect(associationBo.$parent).to.eql(definitionsBo);
              expect(definitionsBo.get('artifact')).to.include(associationBo);
            }
          ));

        });


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

    });

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


    it('should update bounds on resize', inject(
      function(elementRegistry, modeling) {

        // given
        var textAnnotation = elementRegistry.get('TextAnnotation_1');

        // when
        modeling.resizeShape(textAnnotation, { width: 150, height: 180, y: 0, x: 400 });

        // then
        var bo = textAnnotation.businessObject,
            bounds = getBounds(bo);

        expect(bounds).to.include({
          x: 400,
          y: 0,
          width: 150,
          height: 180
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

        expect(edge.waypoint).to.have.lengthOf(3);
        expect(edge.waypoint[ 0 ]).to.include({ x: 247, y: 280 });
        expect(edge.waypoint[ 0 ].original).not.to.exist;
        expect(edge.waypoint[ 1 ]).to.include({ x: 247, y: 280 });
        expect(edge.waypoint[ 1 ].original).not.to.exist;
        expect(edge.waypoint[ 2 ]).to.include({ x: 247, y: 300 });
        expect(edge.waypoint[ 2 ].original).not.to.exist;
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


  describe('update connection reference', function() {

    describe('information requirement', function() {

      it('should update source on reconnect start', inject(
        function(elementRegistry, modeling) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              informationRequirementBo = informationRequirement.businessObject,
              decision3 = elementRegistry.get('Decision_3');

          // when
          modeling.reconnectStart(informationRequirement, decision3, getMid(decision3));

          // then
          expect(informationRequirementBo.requiredDecision.get('href')).to.equal('#Decision_3');
        }
      ));


      it('should preserve the element reference when only its href changes', inject(
        function(elementRegistry, modeling) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              informationRequirementBo = informationRequirement.businessObject,
              decision3 = elementRegistry.get('Decision_3'),
              elementRef = informationRequirementBo.requiredDecision;

          elementRef.someExtension = 'keep-me';

          // when
          modeling.reconnectStart(informationRequirement, decision3, getMid(decision3));

          // then
          expect(informationRequirementBo.requiredDecision).to.equal(elementRef);
          expect(informationRequirementBo.requiredDecision.someExtension).to.equal('keep-me');
        }
      ));


      it('should revert source on reconnect start undo', inject(
        function(commandStack, elementRegistry, modeling) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              informationRequirementBo = informationRequirement.businessObject,
              decision3 = elementRegistry.get('Decision_3');

          modeling.reconnectStart(informationRequirement, decision3, getMid(decision3));

          // when
          commandStack.undo();

          // then
          expect(informationRequirementBo.requiredDecision.get('href')).to.equal('#Decision_1');
        }
      ));


      it('should not update source on reconnect end', inject(
        function(elementRegistry, modeling) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              informationRequirementBo = informationRequirement.businessObject,
              decision3 = elementRegistry.get('Decision_3');

          // when
          modeling.reconnectEnd(informationRequirement, decision3, getMid(decision3));

          // then
          expect(informationRequirementBo.requiredDecision.get('href')).to.equal('#Decision_1');
        }
      ));


      it('should not touch the untouched source reference on reconnect end', inject(
        function(elementRegistry, modeling) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              informationRequirementBo = informationRequirement.businessObject,
              decision3 = elementRegistry.get('Decision_3'),
              elementRef = informationRequirementBo.requiredDecision;

          elementRef.set('href', 'other-namespace#Decision_1');

          // when
          modeling.reconnectEnd(informationRequirement, decision3, getMid(decision3));

          // then
          expect(informationRequirementBo.requiredDecision).to.equal(elementRef);
          expect(informationRequirementBo.requiredDecision.get('href'))
            .to.equal('other-namespace#Decision_1');
        }
      ));


      it('should switch requirement property when source type changes', inject(
        function(elementRegistry, modeling) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              informationRequirementBo = informationRequirement.businessObject,
              inputData = elementRegistry.get('InputData_1');

          // when
          modeling.reconnectStart(informationRequirement, inputData, getMid(inputData));

          // then
          expect(informationRequirementBo.requiredDecision).not.to.exist;
          expect(informationRequirementBo.requiredInput.get('href')).to.equal('#InputData_1');
        }
      ));


      it('should preserve the element reference when switching property', inject(
        function(elementRegistry, modeling) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              informationRequirementBo = informationRequirement.businessObject,
              inputData = elementRegistry.get('InputData_1'),
              elementRef = informationRequirementBo.requiredDecision;

          elementRef.someExtension = 'keep-me';

          // when
          modeling.reconnectStart(informationRequirement, inputData, getMid(inputData));

          // then
          expect(informationRequirementBo.requiredInput).to.equal(elementRef);
          expect(informationRequirementBo.requiredInput.someExtension).to.equal('keep-me');
        }
      ));


      it('should revert requirement property switch on undo', inject(
        function(commandStack, elementRegistry, modeling) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              informationRequirementBo = informationRequirement.businessObject,
              inputData = elementRegistry.get('InputData_1');

          modeling.reconnectStart(informationRequirement, inputData, getMid(inputData));

          // when
          commandStack.undo();

          // then
          expect(informationRequirementBo.requiredInput).not.to.exist;
          expect(informationRequirementBo.requiredDecision.get('href')).to.equal('#Decision_1');
        }
      ));


      it('should update the exported XML', injectAsync(function(done) {
        return function(elementRegistry, modeling, moddle) {

          // given
          var informationRequirement = elementRegistry.get('InformationRequirement_1'),
              decision3 = elementRegistry.get('Decision_3'),
              definitions = elementRegistry.get('Definitions_1').businessObject;

          // when
          modeling.reconnectStart(informationRequirement, decision3, getMid(decision3));

          // then
          moddle.toXML(definitions).then(function(result) {
            expect(result.xml).to.contain('<requiredDecision href="#Decision_3" />');
            expect(result.xml).not.to.contain('href="#Decision_1"');

            done();
          }).catch(done);
        };
      }));

    });


    describe('knowledge requirement', function() {

      it('should update source on reconnect start', inject(
        function(elementRegistry, modeling) {

          // given
          var knowledgeRequirement = elementRegistry.get('KnowledgeRequirement_1'),
              knowledgeRequirementBo = knowledgeRequirement.businessObject,
              bkm3 = elementRegistry.get('BusinessKnowledgeModel_3');

          // when
          modeling.reconnectStart(knowledgeRequirement, bkm3, getMid(bkm3));

          // then
          expect(knowledgeRequirementBo.requiredKnowledge.get('href'))
            .to.equal('#BusinessKnowledgeModel_3');
        }
      ));

    });


    describe('authority requirement', function() {

      it('should update source on reconnect start', inject(
        function(elementRegistry, modeling) {

          // given
          var authorityRequirement = elementRegistry.get('AuthorityRequirement_1'),
              authorityRequirementBo = authorityRequirement.businessObject,
              inputData = elementRegistry.get('InputData_1');

          // when
          modeling.reconnectStart(authorityRequirement, inputData, getMid(inputData));

          // then
          expect(authorityRequirementBo.requiredDecision).not.to.exist;
          expect(authorityRequirementBo.requiredInput.get('href')).to.equal('#InputData_1');
        }
      ));


      it('should move to the new parent when the connection reverses', inject(
        function(elementRegistry, modeling) {

          // given
          var knowledgeSource = elementRegistry.get('KnowledgeSource_1'),
              decision1 = elementRegistry.get('Decision_1'),
              inputData = elementRegistry.get('InputData_1'),
              authorityRequirement = modeling.connect(knowledgeSource, decision1),
              authorityRequirementBo = authorityRequirement.businessObject;

          // when
          // reconnecting the target (decision1) to inputData is invalid
          // (knowledgeSource -> inputData is not a valid pairing), so diagram-js's
          // bendpoint drag reverses the connection instead of rejecting the drop,
          // reusing the old source (knowledgeSource) as the new target/parent
          modeling.reconnect(
            authorityRequirement, inputData, knowledgeSource, getMid(inputData)
          );

          // then
          expect(authorityRequirementBo.$parent).to.equal(knowledgeSource.businessObject);
          expect(authorityRequirementBo.requiredInput.get('href')).to.equal('#InputData_1');
        }
      ));

    });


    describe('association', function() {

      it('should update sourceRef on reconnect start', inject(
        function(elementRegistry, modeling) {

          // given
          var association = elementRegistry.get('Association_1'),
              associationBo = association.businessObject,
              decision1 = elementRegistry.get('Decision_1');

          // when
          modeling.reconnectStart(association, decision1, getMid(decision1));

          // then
          expect(associationBo.sourceRef.get('href')).to.equal('#Decision_1');
          expect(associationBo.targetRef.get('href')).to.equal('#TextAnnotation_2');
        }
      ));


      it('should revert sourceRef on reconnect start undo', inject(
        function(commandStack, elementRegistry, modeling) {

          // given
          var association = elementRegistry.get('Association_1'),
              associationBo = association.businessObject,
              decision1 = elementRegistry.get('Decision_1');

          modeling.reconnectStart(association, decision1, getMid(decision1));

          // when
          commandStack.undo();

          // then
          expect(associationBo.sourceRef.get('href')).to.equal('#Decision_3');
        }
      ));


      it('should update targetRef on reconnect end', inject(
        function(elementRegistry, modeling) {

          // given
          var association = elementRegistry.get('Association_1'),
              associationBo = association.businessObject,
              textAnnotation1 = elementRegistry.get('TextAnnotation_1');

          // when
          modeling.reconnectEnd(association, textAnnotation1, getMid(textAnnotation1));

          // then
          expect(associationBo.targetRef.get('href')).to.equal('#TextAnnotation_1');
          expect(associationBo.sourceRef.get('href')).to.equal('#Decision_3');
        }
      ));


      it('should not touch the untouched sourceRef on reconnect end', inject(
        function(elementRegistry, modeling) {

          // given
          var association = elementRegistry.get('Association_1'),
              associationBo = association.businessObject,
              textAnnotation1 = elementRegistry.get('TextAnnotation_1'),
              elementRef = associationBo.sourceRef;

          elementRef.set('href', 'other-namespace#Decision_3');

          // when
          modeling.reconnectEnd(association, textAnnotation1, getMid(textAnnotation1));

          // then
          expect(associationBo.sourceRef).to.equal(elementRef);
          expect(associationBo.sourceRef.get('href')).to.equal('other-namespace#Decision_3');
        }
      ));


      it('should not touch the untouched targetRef on reconnect start', inject(
        function(elementRegistry, modeling) {

          // given
          var association = elementRegistry.get('Association_1'),
              associationBo = association.businessObject,
              decision1 = elementRegistry.get('Decision_1'),
              elementRef = associationBo.targetRef;

          elementRef.set('href', 'other-namespace#TextAnnotation_2');

          // when
          modeling.reconnectStart(association, decision1, getMid(decision1));

          // then
          expect(associationBo.targetRef).to.equal(elementRef);
          expect(associationBo.targetRef.get('href')).to.equal('other-namespace#TextAnnotation_2');
        }
      ));


      it('should revert targetRef on reconnect end undo', inject(
        function(commandStack, elementRegistry, modeling) {

          // given
          var association = elementRegistry.get('Association_1'),
              associationBo = association.businessObject,
              textAnnotation1 = elementRegistry.get('TextAnnotation_1');

          modeling.reconnectEnd(association, textAnnotation1, getMid(textAnnotation1));

          // when
          commandStack.undo();

          // then
          expect(associationBo.targetRef.get('href')).to.equal('#TextAnnotation_2');
        }
      ));


      it('should preserve the sourceRef element reference', inject(
        function(elementRegistry, modeling) {

          // given
          var association = elementRegistry.get('Association_1'),
              associationBo = association.businessObject,
              decision1 = elementRegistry.get('Decision_1'),
              elementRef = associationBo.sourceRef;

          elementRef.someExtension = 'keep-me';

          // when
          modeling.reconnectStart(association, decision1, getMid(decision1));

          // then
          expect(associationBo.sourceRef).to.equal(elementRef);
          expect(associationBo.sourceRef.someExtension).to.equal('keep-me');
        }
      ));

    });

  });
});


// helpers //////////

function getBounds(businessObject) {
  return businessObject.di.bounds;
}

function getEdge(connection) {
  return connection.businessObject.di;
}
