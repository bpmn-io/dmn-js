import { expect } from 'chai';
import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import diGeneratorModule from 'src/features/generate-di';

import noDiXML from 'test/fixtures/dmn/no-di.dmn';
import emptyDefinitionsXML from 'test/fixtures/dmn/empty-definitions.dmn';
import noDiDecisionServiceXML from 'test/fixtures/dmn/no-di-decision-service.dmn';


describe('features - generate-di', function() {

  beforeEach(bootstrapModeler(noDiXML, {
    modules: [
      coreModule,
      modelingModule,
      diGeneratorModule
    ]
  }));


  it('should render decisions', inject(function(elementRegistry) {

    // when
    var elements = elementRegistry.getAll();

    // then
    expect(elements).to.have.length(5);
  }));


  it('should generate deciisions DMNDI', inject(function(canvas) {

    // when
    var rootElement = canvas.getRootElement();

    var definitions = rootElement.businessObject;

    // then
    expect(definitions.dmnDI).to.exist;
    expect(definitions.dmnDI.diagrams).to.have.length(1);
    expect(definitions.dmnDI.diagrams[0].diagramElements).to.have.length(4);
  }));


  it('should not render non-decision elements', inject(function(elementRegistry) {

    // when
    var inputData = elementRegistry.get('InputData_1');

    // then
    expect(inputData).to.not.exist;
  }));


  describe('empty definitions', function() {

    beforeEach(bootstrapModeler(emptyDefinitionsXML, {
      modules: [
        coreModule,
        modelingModule,
        diGeneratorModule
      ]
    }));


    it('should open empty definitions', inject(function(canvas) {

      // then
      expect(canvas.getRootElement()).to.have.property('id', 'definitions');
    }));
  });


  describe('decision service', function() {

    beforeEach(bootstrapModeler(noDiDecisionServiceXML, {
      modules: [
        coreModule,
        modelingModule,
        diGeneratorModule
      ]
    }));


    it('should generate DI for the decision service', inject(function(elementRegistry) {

      // when
      var decisionService = elementRegistry.get('DecisionService_1');

      // then
      expect(decisionService).to.exist;
      expect(decisionService.businessObject.di.decisionServiceDividerLine).to.exist;
    }));


    it('should parent contained decisions under the generated decision service', inject(
      function(elementRegistry) {

        // when
        var decisionService = elementRegistry.get('DecisionService_1');
        var outputDecision = elementRegistry.get('OutputDecision');
        var encapsulatedDecision = elementRegistry.get('EncapsulatedDecision');

        // then
        expect(outputDecision.parent).to.equal(decisionService);
        expect(encapsulatedDecision.parent).to.equal(decisionService);
      }
    ));


    it('should size the generated decision service to contain its decisions', inject(
      function(elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1');

        // when
        var decisions = [
          elementRegistry.get('OutputDecision'),
          elementRegistry.get('EncapsulatedDecision')
        ];

        // then
        decisions.forEach(function(decision) {
          expect(decision.x).to.be.at.least(decisionService.x);
          expect(decision.y).to.be.at.least(decisionService.y);
          expect(decision.x + decision.width).to.be.at.most(decisionService.x + decisionService.width);
          expect(decision.y + decision.height).to.be.at.most(decisionService.y + decisionService.height);
        });
      }
    ));


    it('should lay out decisions in their sections of the generated decision service', inject(
      function(elementRegistry) {

        // given
        var decisionService = elementRegistry.get('DecisionService_1'),
            outputDecision = elementRegistry.get('OutputDecision'),
            encapsulatedDecision = elementRegistry.get('EncapsulatedDecision');

        // when
        var dividerY = decisionService.businessObject.di.decisionServiceDividerLine.waypoint[0].y;

        // then
        expect(outputDecision.y + outputDecision.height).to.be.at.most(dividerY);
        expect(encapsulatedDecision.y).to.be.at.least(dividerY);
      }
    ));

  });
});
