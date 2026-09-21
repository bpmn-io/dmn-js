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

import { MIN_SECTION_HEIGHT } from 'src/features/decision-service-divider/DecisionServiceDivider';

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


  describe('DecisionService', function() {

    var decisionServiceXML = require('./drd-updater-decision-service.dmn');

    beforeEach(bootstrapModeler(decisionServiceXML, { modules: testModules }));


    describe('update parent', function() {

      it('should update parent when decision is moved into DecisionService', inject(
        function(elementRegistry, modeling) {

          // given
          var decision = elementRegistry.get('Decision_Outside'),
              decisionBo = decision.businessObject,
              decisionService = elementRegistry.get('DecisionService_1'),
              decisionServiceBo = decisionService.businessObject,
              definitions = elementRegistry.get('Definitions_1'),
              definitionsBo = definitions.businessObject;

          // when
          modeling.moveShape(decision, { x: 150, y: 280 }, decisionService);

          // then
          expect(decision.parent).to.equal(decisionService);
          expect(decisionBo.$parent).to.equal(definitionsBo);
          expect(definitionsBo.drgElement).to.include(decisionBo);

          var outputDecisions = decisionServiceBo.get('outputDecision');
          expect(outputDecisions.some(function(d) {
            return d.href === '#Decision_Outside';
          })).to.be.true;
        }
      ));


      it('should update parent when decision is moved out of DecisionService', inject(
        function(elementRegistry, modeling) {

          // given
          var decision = elementRegistry.get('Decision_InOutput'),
              decisionBo = decision.businessObject,
              decisionService = elementRegistry.get('DecisionService_1'),
              decisionServiceBo = decisionService.businessObject,
              definitions = elementRegistry.get('Definitions_1'),
              definitionsBo = definitions.businessObject;

          // when
          modeling.moveShape(decision, { x: 300, y: -100 }, definitions);

          // then
          expect(decision.parent).to.equal(definitions);
          expect(decisionBo.$parent).to.equal(definitionsBo);
          expect(definitionsBo.drgElement).to.include(decisionBo);

          var outputDecisions = decisionServiceBo.get('outputDecision');
          expect(outputDecisions.some(function(d) {
            return d.href === '#Decision_InOutput';
          })).to.be.false;
        }
      ));

      it('should keep divider line in place when DecisionService is resized', inject(
        function(elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1'),
              decisionServiceBo = decisionService.businessObject;

          // when
          modeling.resizeShape(decisionService, {
            x: decisionService.x,
            y: decisionService.y,
            width: 500,
            height: 600
          });

          // then
          var dividerLine = decisionServiceBo.di.decisionServiceDividerLine;

          expect(dividerLine.waypoint).to.have.lengthOf(2);
          expect(dividerLine.waypoint[0]).to.include({ x: 100, y: 450 });
          expect(dividerLine.waypoint[1]).to.include({ x: 600, y: 450 });
        }
      ));


      it('should keep divider line in place when DecisionService is resized from top', inject(
        function(elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1'),
              decisionServiceBo = decisionService.businessObject;

          // when
          modeling.resizeShape(decisionService, {
            x: decisionService.x,
            y: 200,
            width: decisionService.width,
            height: 400
          });

          // then
          var dividerLine = decisionServiceBo.di.decisionServiceDividerLine;

          expect(dividerLine.waypoint[0].y).to.equal(450);
          expect(dividerLine.waypoint[1].y).to.equal(450);
        }
      ));


      it('should keep contained decisions in their sections when DecisionService is resized', inject(
        function(elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1'),
              decisionServiceBo = decisionService.businessObject;

          // when
          modeling.resizeShape(decisionService, {
            x: decisionService.x,
            y: decisionService.y,
            width: decisionService.width,
            height: 600
          });

          // then
          expect(decisionServiceBo.get('encapsulatedDecision').map(function(d) {
            return d.href;
          })).to.eql([ '#Decision_InEncapsulated' ]);
        }
      ));


      it('should keep divider line within minimum section height when DecisionService is shrunk', inject(
        function(elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1'),
              decisionServiceBo = decisionService.businessObject;

          // when
          modeling.resizeShape(decisionService, {
            x: decisionService.x,
            y: decisionService.y,
            width: decisionService.width,
            height: 250
          });

          // then
          var dividerLine = decisionServiceBo.di.decisionServiceDividerLine;

          expect(dividerLine.waypoint[0].y).to.equal(
            decisionService.y + decisionService.height - MIN_SECTION_HEIGHT
          );
        }
      ));


      it('should restore divider line when DecisionService resize is undone', inject(
        function(commandStack, elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1'),
              decisionServiceBo = decisionService.businessObject;

          modeling.resizeShape(decisionService, {
            x: decisionService.x,
            y: decisionService.y,
            width: decisionService.width,
            height: 250
          });

          // when
          commandStack.undo();

          // then
          var dividerLine = decisionServiceBo.di.decisionServiceDividerLine;

          expect(dividerLine.waypoint[0].y).to.equal(450);
          expect(dividerLine.waypoint[1].y).to.equal(450);
        }
      ));


      it('should move divider line along with DecisionService', inject(
        function(elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1'),
              decisionServiceBo = decisionService.businessObject;

          // when
          modeling.moveElements([ decisionService ], { x: 50, y: 100 });

          // then
          var dividerLine = decisionServiceBo.di.decisionServiceDividerLine;

          expect(dividerLine.waypoint[0]).to.include({ x: 150, y: 550 });
          expect(dividerLine.waypoint[1]).to.include({ x: 550, y: 550 });
        }
      ));

    });


    describe('move', function() {

      function getSections(decisionService) {
        var decisionServiceBo = decisionService.businessObject;

        return {
          output: (decisionServiceBo.get('outputDecision') || []).map(function(ref) {
            return ref.href;
          }),
          encapsulated: (decisionServiceBo.get('encapsulatedDecision') || []).map(function(ref) {
            return ref.href;
          })
        };
      }

      function getDividerY(decisionService) {
        return decisionService.businessObject.di.decisionServiceDividerLine.waypoint[0].y;
      }

      var UNCHANGED = {
        output: [ '#Decision_InOutput' ],
        encapsulated: [ '#Decision_InEncapsulated' ]
      };


      describe('decision service', function() {

        it('should keep decisions in their sections', inject(
          function(elementRegistry, modeling) {

            // given
            var decisionService = elementRegistry.get('DecisionService_1');

            // when
            modeling.moveElements([ decisionService ], { x: 0, y: 100 });

            // then
            expect(getDividerY(decisionService)).to.equal(550);
            expect(getSections(decisionService)).to.eql(UNCHANGED);
          }
        ));


        it('should keep decisions in their sections on undo', inject(
          function(commandStack, elementRegistry, modeling) {

            // given
            var decisionService = elementRegistry.get('DecisionService_1'),
                encapsulatedDecision = elementRegistry.get('Decision_InEncapsulated');

            modeling.moveElements([ decisionService ], { x: 0, y: 100 });

            // when
            commandStack.undo();

            // then
            expect(decisionService.y).to.equal(300);
            expect(encapsulatedDecision.y).to.equal(500);
            expect(getDividerY(decisionService)).to.equal(450);
            expect(getSections(decisionService)).to.eql(UNCHANGED);
          }
        ));


        it('should keep decisions in their sections on redo', inject(
          function(commandStack, elementRegistry, modeling) {

            // given
            var decisionService = elementRegistry.get('DecisionService_1'),
                encapsulatedDecision = elementRegistry.get('Decision_InEncapsulated');

            modeling.moveElements([ decisionService ], { x: 0, y: 100 });

            commandStack.undo();

            // when
            commandStack.redo();

            // then
            expect(decisionService.y).to.equal(400);
            expect(encapsulatedDecision.y).to.equal(600);
            expect(getDividerY(decisionService)).to.equal(550);
            expect(getSections(decisionService)).to.eql(UNCHANGED);
          }
        ));


        it('should keep decisions in their sections on undo (shape move)', inject(
          function(commandStack, elementRegistry, modeling) {

            // given
            var decisionService = elementRegistry.get('DecisionService_1');

            modeling.moveShape(decisionService, { x: 0, y: 100 });

            // when
            commandStack.undo();

            // then
            expect(getDividerY(decisionService)).to.equal(450);
            expect(getSections(decisionService)).to.eql(UNCHANGED);
          }
        ));


        it('should not reassign decisions not matching their position', inject(
          function(commandStack, elementRegistry, modeling) {

            // given
            var decisionService = elementRegistry.get('DecisionService_1'),
                dividerLine = decisionService.businessObject.di.decisionServiceDividerLine;

            // the divider is below the encapsulated decision
            dividerLine.waypoint[0].y = dividerLine.waypoint[1].y = 600;

            // when
            modeling.moveElements([ decisionService ], { x: 0, y: 100 });

            commandStack.undo();
            commandStack.redo();

            // then
            expect(getSections(decisionService)).to.eql(UNCHANGED);
          }
        ));

      });


      describe('decision', function() {

        it('should assign decision to the section it is moved to', inject(
          function(elementRegistry, modeling) {

            // given
            var decisionService = elementRegistry.get('DecisionService_1'),
                outputDecision = elementRegistry.get('Decision_InOutput');

            // when
            modeling.moveShape(outputDecision, { x: 0, y: 150 }, decisionService);

            // then
            expect(getSections(decisionService)).to.eql({
              output: [],
              encapsulated: [ '#Decision_InEncapsulated', '#Decision_InOutput' ]
            });
          }
        ));


        it('should restore section on undo', inject(
          function(commandStack, elementRegistry, modeling) {

            // given
            var decisionService = elementRegistry.get('DecisionService_1'),
                outputDecision = elementRegistry.get('Decision_InOutput');

            modeling.moveShape(outputDecision, { x: 0, y: 150 }, decisionService);

            // when
            commandStack.undo();

            // then
            expect(getSections(decisionService)).to.eql(UNCHANGED);
          }
        ));


        it('should assign section again on redo', inject(
          function(commandStack, elementRegistry, modeling) {

            // given
            var decisionService = elementRegistry.get('DecisionService_1'),
                outputDecision = elementRegistry.get('Decision_InOutput');

            modeling.moveShape(outputDecision, { x: 0, y: 150 }, decisionService);

            commandStack.undo();

            // when
            commandStack.redo();

            // then
            expect(getSections(decisionService)).to.eql({
              output: [],
              encapsulated: [ '#Decision_InEncapsulated', '#Decision_InOutput' ]
            });
          }
        ));

      });

    });


    describe('create', function() {

      function createDecision(elementFactory, modeling, decisionService) {
        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        modeling.createShape(decision, { x: 300, y: 380 }, decisionService);

        return decision;
      }

      function hasReference(decisionServiceBo, decisionBo) {
        return [ 'outputDecision', 'encapsulatedDecision' ].some(function(name) {
          return (decisionServiceBo.get(name) || []).some(function(ref) {
            return ref.href === '#' + decisionBo.id;
          });
        });
      }


      it('should reference decision created in DecisionService', inject(
        function(elementFactory, elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1');

          // when
          var decision = createDecision(elementFactory, modeling, decisionService);

          // then
          expect(hasReference(decisionService.businessObject, decision.businessObject)).to.be.true;
        }
      ));


      it('should remove reference on undo', inject(
        function(commandStack, elementFactory, elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1');

          var decision = createDecision(elementFactory, modeling, decisionService);

          // when
          commandStack.undo();

          // then
          expect(hasReference(decisionService.businessObject, decision.businessObject)).to.be.false;
        }
      ));


      it('should restore reference on redo', inject(
        function(commandStack, elementFactory, elementRegistry, modeling) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1');

          var decision = createDecision(elementFactory, modeling, decisionService);

          commandStack.undo();

          // when
          commandStack.redo();

          // then
          expect(hasReference(decisionService.businessObject, decision.businessObject)).to.be.true;
        }
      ));

    });


    describe('update inputs on delete', function() {

      it('should remove input decision when requirement is deleted', inject(
        function(elementRegistry, modeling) {

          // given
          var outsideDecision = elementRegistry.get('Decision_Outside'),
              outputDecision = elementRegistry.get('Decision_InOutput'),
              decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

          var requirement = modeling.connect(outsideDecision, outputDecision);

          // when
          modeling.removeConnection(requirement);

          // then
          expect(decisionServiceBo.get('inputDecision') || []).to.be.empty;
        }
      ));

    });


    describe('update inputs on reconnect', function() {

      it('should update decision service inputs when a requirement is reconnected', inject(
        function(elementRegistry, modeling) {

          // given
          var outsideDecision = elementRegistry.get('Decision_Outside'),
              outputDecision = elementRegistry.get('Decision_InOutput'),
              standaloneDecision = elementRegistry.get('Decision_Standalone'),
              decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

          var requirement = modeling.connect(outsideDecision, outputDecision);

          // when
          modeling.reconnectStart(requirement, standaloneDecision, getMid(standaloneDecision));

          // then
          var inputDecisions = decisionServiceBo.get('inputDecision');
          expect(inputDecisions.some(function(d) {
            return d.href === '#Decision_Standalone';
          })).to.be.true;
          expect(inputDecisions.some(function(d) {
            return d.href === '#Decision_Outside';
          })).to.be.false;
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
