import {
  bootstrapModeler,
  inject
} from 'test/helper';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';

import diagramXML from './decision-service-behavior.dmn';


describe('DecisionServiceBehavior', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  describe('_getDividerPosition', function() {

    it('should calculate divider position at center of decision service', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decisionService = elementRegistry.get('DecisionService_1');
        const expectedY = decisionService.y + (decisionService.height / 2);

        // when
        const dividerY = decisionServiceBehavior._getDividerPosition(decisionService);

        // then
        expect(dividerY).to.equal(expectedY);
      })
    );

  });


  describe('isOutputDecision', function() {

    it('should identify decision in output section (top half)', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decision = elementRegistry.get('Decision_InOutput');
        const decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

        // when
        const result = decisionServiceBehavior.isOutputDecision(decision, decisionServiceBo);

        // then
        expect(result).to.be.true;
      })
    );


    it('should identify decision in encapsulated section (bottom half)', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decision = elementRegistry.get('Decision_InEncapsulated');
        const decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

        // when
        const result = decisionServiceBehavior.isOutputDecision(decision, decisionServiceBo);

        // then
        expect(result).to.be.false;
      })
    );

  });


  describe('addDecisionToService', function() {

    it('should add decision to appropriate section based on position', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decision = elementRegistry.get('Decision_Standalone');
        const decisionBo = decision.businessObject;
        const decisionServiceBo = elementRegistry.get('DecisionService_2').businessObject;
        const definitions = elementRegistry.get('_definitions').businessObject;

        // when
        decisionServiceBehavior.addDecisionToService(decisionBo, decisionServiceBo, definitions);

        // then
        const outputDecisions = decisionServiceBo.get('outputDecision') || [];
        expect(outputDecisions.some(ref => ref.href === '#Decision_Standalone')).to.be.true;
        expect(decisionBo.$parent).to.equal(definitions);
      })
    );


    it('should not add duplicate references', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decision = elementRegistry.get('Decision_InOutput');
        const decisionBo = decision.businessObject;
        const decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;
        const definitions = elementRegistry.get('_definitions').businessObject;
        const initialCount = (decisionServiceBo.get('outputDecision') || []).length;

        // when
        decisionServiceBehavior.addDecisionToService(decisionBo, decisionServiceBo, definitions);

        // then
        expect((decisionServiceBo.get('outputDecision') || []).length).to.equal(initialCount);
      })
    );

  });


  describe('removeDecisionFromService', function() {

    it('should remove decision from service', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decisionBo = elementRegistry.get('Decision_InOutput').businessObject;
        const decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

        // when
        decisionServiceBehavior.removeDecisionFromService(decisionBo, decisionServiceBo);

        // then
        const outputDecisions = decisionServiceBo.get('outputDecision') || [];
        expect(outputDecisions.some(ref => ref.href === '#Decision_InOutput')).to.be.false;
      })
    );

  });





  describe('updateInputsFromOutputDecisions', function() {

    it('should automatically identify external input decisions', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

        // when
        decisionServiceBehavior.updateInputsFromOutputDecisions(decisionServiceBo);

        // then - Decision_1 should be identified as input decision
        const inputDecisions = decisionServiceBo.get('inputDecision') || [];
        expect(inputDecisions.some(ref => ref.href === '#Decision_1')).to.be.true;
      })
    );


    it('should automatically identify required input data', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

        // when
        decisionServiceBehavior.updateInputsFromOutputDecisions(decisionServiceBo);

        // then - InputData_1 should be identified
        const inputData = decisionServiceBo.get('inputData') || [];
        expect(inputData.some(ref => ref.href === '#InputData_1')).to.be.true;
      })
    );


    it('should not include encapsulated decisions as inputs', inject(
      function(decisionServiceBehavior, elementRegistry, modeling) {

        // given
        const decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;
        const outputDecision = elementRegistry.get('Decision_InOutput');
        const encapsulatedDecision = elementRegistry.get('Decision_InEncapsulated');

        // Create connection from output to encapsulated
        modeling.connect(outputDecision, encapsulatedDecision);

        // when
        decisionServiceBehavior.updateInputsFromOutputDecisions(decisionServiceBo);

        // then
        const inputDecisions = decisionServiceBo.get('inputDecision') || [];
        expect(inputDecisions.some(ref => ref.href === '#Decision_InEncapsulated')).to.be.false;
      })
    );

  });





  describe('removeElementFromAllServices', function() {

    it('should remove element from all service collections', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;
        const definitions = elementRegistry.get('_definitions').businessObject;

        // when
        decisionServiceBehavior.removeElementFromAllServices('Decision_InOutput', definitions);

        // then
        const outputDecisions = decisionServiceBo.get('outputDecision') || [];
        const inputDecisions = decisionServiceBo.get('inputDecision') || [];

        expect(outputDecisions.some(ref => ref.href === '#Decision_InOutput')).to.be.false;
        expect(inputDecisions.some(ref => ref.href === '#Decision_InOutput')).to.be.false;
      })
    );

  });


  describe('updateAllServices', function() {

    it('should update all decision services in definitions', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const definitions = elementRegistry.get('_definitions').businessObject;

        // when/then - should not throw
        expect(function() {
          decisionServiceBehavior.updateAllServices(definitions);
        }).not.to.throw();
      })
    );

  });

});
