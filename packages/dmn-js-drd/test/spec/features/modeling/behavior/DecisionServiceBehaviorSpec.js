import { expect } from 'chai';

import {
  bootstrapModeler,
  inject
} from 'test/helper';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';
import ReplaceModule from 'src/features/replace';

import diagramXML from './decision-service-behavior.dmn';
import hrefsXML from 'test/fixtures/dmn/decision-service-hrefs.dmn';


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


  describe('updateDecisionSection', function() {

    it('should remove the stale reference when moving a decision to another service', inject(
      function(decisionServiceBehavior, elementRegistry) {

        // given
        const decision = elementRegistry.get('Decision_InOutput');
        const oldServiceBo = elementRegistry.get('DecisionService_1').businessObject;
        const newServiceBo = elementRegistry.get('DecisionService_2').businessObject;

        // when
        decisionServiceBehavior.updateDecisionSection(decision, newServiceBo);

        // then
        const oldOutputDecisions = oldServiceBo.get('outputDecision') || [];
        const newOutputDecisions = newServiceBo.get('outputDecision') || [];

        expect(oldOutputDecisions.some(ref => ref.href === '#Decision_InOutput')).to.be.false;
        expect(newOutputDecisions.some(ref => ref.href === '#Decision_InOutput')).to.be.true;
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

        // Make the output decision require the encapsulated decision
        modeling.connect(encapsulatedDecision, outputDecision);

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


describe('DecisionServiceBehavior - replace', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule,
      ReplaceModule
    ]
  }));


  function getReferences(decisionService) {
    var decisionServiceBo = decisionService.businessObject;

    return [
      'outputDecision',
      'encapsulatedDecision',
      'inputDecision',
      'inputData'
    ].reduce(function(references, name) {
      references[name] = (decisionServiceBo.get(name) || []).map(function(ref) {
        return ref.href;
      });

      return references;
    }, {});
  }

  var targets = {
    'empty': { type: 'dmn:Decision' },
    'decision table': { type: 'dmn:Decision', table: true },
    'literal expression': { type: 'dmn:Decision', expression: true }
  };


  [ 'Decision_InOutput', 'Decision_InEncapsulated' ].forEach(function(id) {

    Object.keys(targets).forEach(function(target) {

      it('should keep <' + id + '> in its section when replaced with ' + target, inject(
        function(drdReplace, elementRegistry) {

          // given
          var decisionService = elementRegistry.get('DecisionService_1'),
              references = getReferences(decisionService);

          // when
          drdReplace.replaceElement(elementRegistry.get(id), targets[target]);

          // then
          expect(getReferences(decisionService)).to.eql(references);
        }
      ));

    });

  });


  it('should restore references on undo', inject(
    function(commandStack, drdReplace, elementRegistry) {

      // given
      var decisionService = elementRegistry.get('DecisionService_1'),
          references = getReferences(decisionService);

      drdReplace.replaceElement(elementRegistry.get('Decision_InOutput'), targets.empty);

      // when
      commandStack.undo();

      // then
      expect(getReferences(decisionService)).to.eql(references);
    }
  ));


  it('should keep references on redo', inject(
    function(commandStack, drdReplace, elementRegistry) {

      // given
      var decisionService = elementRegistry.get('DecisionService_1'),
          references = getReferences(decisionService);

      drdReplace.replaceElement(elementRegistry.get('Decision_InOutput'), targets.empty);

      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(getReferences(decisionService)).to.eql(references);
    }
  ));


  describe('moving the replacement', function() {

    var references, decisionService;

    beforeEach(inject(function(drdReplace, elementRegistry, modeling) {
      decisionService = elementRegistry.get('DecisionService_1');

      references = getReferences(decisionService);

      var replacement = drdReplace.replaceElement(
        elementRegistry.get('Decision_InOutput'),
        targets.empty
      );

      modeling.moveShape(replacement, { x: 0, y: 10 }, decisionService);
    }));


    it('should keep references', function() {

      // then
      expect(getReferences(decisionService)).to.eql(references);
    });


    it('should keep references on undo', inject(function(commandStack) {

      // when
      commandStack.undo();

      // then
      expect(getReferences(decisionService)).to.eql(references);
    }));


    it('should keep references on redo', inject(function(commandStack) {

      // given
      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(getReferences(decisionService)).to.eql(references);
    }));

  });

});


describe('DecisionServiceBehavior - id change', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  it('should update the output decision reference when the decision is renamed', inject(
    function(elementRegistry, modeling) {

      // given
      var decision = elementRegistry.get('Decision_InOutput');
      var decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

      // when
      modeling.updateProperties(decision, { id: 'Decision_Renamed' });

      // then
      var outputDecisions = decisionServiceBo.get('outputDecision') || [];
      expect(outputDecisions.some(function(ref) {
        return ref.href === '#Decision_Renamed';
      })).to.be.true;
    }
  ));


  it('should update the input data reference when the input data is renamed', inject(
    function(elementRegistry, modeling) {

      // given
      var inputData = elementRegistry.get('InputData_1');
      var decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

      // when
      modeling.updateProperties(inputData, { id: 'InputData_Renamed' });

      // then
      var inputDataRefs = decisionServiceBo.get('inputData') || [];
      expect(inputDataRefs.some(function(ref) {
        return ref.href === '#InputData_Renamed';
      })).to.be.true;
    }
  ));

});


describe('DecisionServiceBehavior - semantic references', function() {

  beforeEach(bootstrapModeler(hrefsXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  function getHrefs(decisionServiceBo, name) {
    return decisionServiceBo.get(name).map(function(ref) {
      return ref.href;
    });
  }


  it('should keep inputs of decisions without a shape', inject(
    function(canvas, decisionServiceBehavior, elementRegistry) {

      // given
      var definitions = canvas.getRootElement().businessObject,
          decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

      // when
      decisionServiceBehavior.updateAllServices(definitions);

      // then
      expect(getHrefs(decisionServiceBo, 'inputDecision')).to.eql([ 'model.dmn#Decision_Required' ]);
      expect(getHrefs(decisionServiceBo, 'inputData')).to.eql([ 'model.dmn#InputData_Required' ]);
    }
  ));


  it('should rename references preserving the URI prefix', inject(
    function(elementRegistry, modeling) {

      // given
      var decision = elementRegistry.get('Decision_Required'),
          decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

      // when
      modeling.updateProperties(decision, { id: 'Decision_Renamed' });

      // then
      expect(getHrefs(decisionServiceBo, 'inputDecision')).to.eql([ 'model.dmn#Decision_Renamed' ]);
    }
  ));


  it('should resolve prefixed references when removing a decision', inject(
    function(decisionServiceBehavior, canvas, elementRegistry) {

      // given
      var definitions = canvas.getRootElement().businessObject,
          decisionServiceBo = elementRegistry.get('DecisionService_1').businessObject;

      // when
      decisionServiceBehavior.removeElementFromAllServices('Decision_Member', definitions);

      // then
      expect(getHrefs(decisionServiceBo, 'outputDecision')).to.be.empty;
    }
  ));

});
