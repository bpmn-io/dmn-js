import { expect } from 'chai';
import {
  bootstrapModeler,
  inject
} from '../../../TestHelper';

import modelingModule from 'src/features/modeling';
import replaceModule from 'src/features/replace';
import moveModule from 'diagram-js/lib/features/move';
import coreModule from 'src/core';

import {
  is
} from 'dmn-js-shared/lib/util/ModelUtil';


// helpers //////////////////////

function getFormalParameters(element) {
  return element.businessObject.encapsulatedLogic.get('formalParameter');
}

function describeFormalParameters(element) {
  return getFormalParameters(element).map(function(parameter) {
    return [ parameter.name, parameter.typeRef, parameter.label ];
  });
}


describe('features/replace - drd replace', function() {

  var testModules = [
    coreModule,
    modelingModule,
    replaceModule,
    moveModule
  ];


  describe('should replace', function() {

    var diagramXML = require('./replace.dmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


    it('decision table', inject(function(elementRegistry, drdReplace) {

      // given
      var decision = elementRegistry.get('decision');

      var newElementData = {
        type: 'dmn:Decision',
        table: true,
        expression: false
      };

      // when
      var newElement = drdReplace.replaceElement(decision, newElementData);

      // then
      var businessObject = newElement.businessObject;

      expect(newElement).to.exist;

      expect(is(businessObject, 'dmn:Decision')).to.be.true;

      var decisionTable = businessObject.decisionLogic;

      expect(is(decisionTable, 'dmn:DecisionTable')).to.be.true;

      expect(decisionTable).to.exist;

      expect(decisionTable.output).to.have.length(1);
      expect(decisionTable.output[0].id).to.exist;

      expect(decisionTable.input).to.have.length(1);
      expect(decisionTable.input[0].id).to.exist;
    }));


    it('literal expression', inject(function(elementRegistry, drdReplace) {

      // given
      var decision = elementRegistry.get('decision');

      var newElementData = {
        type: 'dmn:Decision',
        table: false,
        expression: true
      };

      // when
      var newElement = drdReplace.replaceElement(decision, newElementData);

      // then
      var businessObject = newElement.businessObject;

      expect(newElement).to.exist;
      expect(is(businessObject, 'dmn:Decision')).to.be.true;

      expect(is(businessObject.decisionLogic, 'dmn:LiteralExpression')).to.be.true;
    }));


    it('should keep existing variable when replacing with literal expression', inject(
      function(elementRegistry, drdReplace, drdFactory, modeling) {

        // given
        var decision = elementRegistry.get('decision'),
            variable = drdFactory.create('dmn:InformationItem', {
              name: decision.businessObject.name,
              typeRef: 'boolean'
            });

        modeling.updateProperties(decision, { variable: variable });

        var newElementData = {
          type: 'dmn:Decision',
          table: false,
          expression: true
        };

        // when
        var newElement = drdReplace.replaceElement(decision, newElementData);

        // then
        expect(newElement.businessObject.variable).to.equal(variable);
        expect(newElement.businessObject.variable.typeRef).to.equal('boolean');
      }
    ));


    it('should keep existing variable when replacing with decision table', inject(
      function(elementRegistry, drdReplace, drdFactory, modeling) {

        // given
        var decision = elementRegistry.get('decision'),
            variable = drdFactory.create('dmn:InformationItem', {
              name: decision.businessObject.name,
              typeRef: 'boolean'
            });

        modeling.updateProperties(decision, { variable: variable });

        var newElementData = {
          type: 'dmn:Decision',
          table: true,
          expression: false
        };

        // when
        var newElement = drdReplace.replaceElement(decision, newElementData);

        // then
        expect(newElement.businessObject.variable).to.equal(variable);
        expect(newElement.businessObject.variable.typeRef).to.equal('boolean');
      }
    ));


    it('nothing', inject(function(elementRegistry, drdReplace) {

      // given
      var decision = elementRegistry.get('table');

      var newElementData = {
        type: 'dmn:Decision',
        table: false,
        expression: false
      };

      // when
      var newElement = drdReplace.replaceElement(decision, newElementData);

      // then
      var businessObject = newElement.businessObject;

      expect(newElement).to.exist;
      expect(is(businessObject, 'dmn:Decision')).to.be.true;

      expect(businessObject.decisionLogic).not.to.exist;
    }));


    it('should undo', inject(function(elementRegistry, drdReplace, commandStack) {

      // given
      var decision = elementRegistry.get('table');

      var newElementData = {
        type: 'dmn:Decision',
        table: false,
        expression: true
      };
      var newElement = drdReplace.replaceElement(decision, newElementData);

      // when
      commandStack.undo();

      // then
      var businessObject = elementRegistry.get('table').businessObject;

      expect(newElement).to.exist;
      expect(is(businessObject, 'dmn:Decision')).to.be.true;

      expect(is(businessObject.decisionLogic, 'dmn:DecisionTable')).to.be.true;
    }));


    it('should redo', inject(function(elementRegistry, drdReplace, commandStack) {

      // given
      var decision = elementRegistry.get('table');

      var newElementData = {
        type: 'dmn:Decision',
        table: false,
        expression: true
      };
      var newElement = drdReplace.replaceElement(decision, newElementData);

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      var businessObject = elementRegistry.get('table').businessObject;

      expect(newElement).to.exist;
      expect(is(businessObject, 'dmn:Decision')).to.be.true;

      expect(is(businessObject.decisionLogic, 'dmn:LiteralExpression')).to.be.true;
    }));
  });


  describe('should keep formal parameters of business knowledge model', function() {

    var diagramXML = require('./replace.dmn');

    var TABLE = {
      type: 'dmn:BusinessKnowledgeModel',
      table: true,
      expression: false
    };

    var LITERAL_EXPRESSION = {
      type: 'dmn:BusinessKnowledgeModel',
      table: false,
      expression: true
    };

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


    it('when replacing literal expression with decision table', inject(
      function(elementRegistry, drdReplace) {

        // given
        var bkm = elementRegistry.get('bkmLiteral');

        // when
        var newElement = drdReplace.replaceElement(bkm, TABLE);

        // then
        expect(describeFormalParameters(newElement)).to.eql([
          [ 'age', 'number', undefined ],
          [ 'dish', undefined, 'Dish' ]
        ]);
      }
    ));


    it('when replacing decision table with literal expression', inject(
      function(elementRegistry, drdReplace) {

        // given
        var bkm = elementRegistry.get('bkmTable');

        // when
        var newElement = drdReplace.replaceElement(bkm, LITERAL_EXPRESSION);

        // then
        expect(describeFormalParameters(newElement)).to.eql([
          [ 'price', 'number', undefined ]
        ]);
      }
    ));


    it('as copies', inject(function(elementRegistry, drdReplace) {

      // given
      var bkm = elementRegistry.get('bkmLiteral');

      var oldParameters = getFormalParameters(bkm);

      // when
      var newElement = drdReplace.replaceElement(bkm, TABLE);

      // then
      var shared = getFormalParameters(newElement).filter(function(parameter) {
        return oldParameters.indexOf(parameter) !== -1;
      });

      expect(shared).to.be.empty;
    }));


    it('with new ids', inject(function(elementRegistry, drdReplace) {

      // given
      var bkm = elementRegistry.get('bkmLiteral');

      var oldIds = getFormalParameters(bkm).map(function(parameter) {
        return parameter.id;
      });

      // when
      var newElement = drdReplace.replaceElement(bkm, TABLE);

      // then
      var newIds = getFormalParameters(newElement).map(function(parameter) {
        return parameter.id;
      });

      expect(newIds).to.have.length(2);

      newIds.forEach(function(id) {
        expect(id).to.exist;
        expect(oldIds).not.to.include(id);
      });
    }));


    it('with function definition as parent', inject(
      function(elementRegistry, drdReplace) {

        // given
        var bkm = elementRegistry.get('bkmLiteral');

        // when
        var newElement = drdReplace.replaceElement(bkm, TABLE);

        // then
        var encapsulatedLogic = newElement.businessObject.encapsulatedLogic;

        expect(encapsulatedLogic.formalParameter.every(function(parameter) {
          return parameter.$parent === encapsulatedLogic;
        })).to.be.true;
      }
    ));


    it('on undo', inject(function(elementRegistry, drdReplace, commandStack) {

      // given
      var bkm = elementRegistry.get('bkmLiteral');

      drdReplace.replaceElement(bkm, TABLE);

      // when
      commandStack.undo();

      // then
      var encapsulatedLogic = elementRegistry.get('bkmLiteral')
        .businessObject.encapsulatedLogic;

      expect(encapsulatedLogic.formalParameter.every(function(parameter) {
        return parameter.$parent === encapsulatedLogic;
      })).to.be.true;
    }));


    it('on redo', inject(function(elementRegistry, drdReplace, commandStack) {

      // given
      var bkm = elementRegistry.get('bkmLiteral');

      drdReplace.replaceElement(bkm, TABLE);

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(describeFormalParameters(elementRegistry.get('bkmLiteral'))).to.eql([
        [ 'age', 'number', undefined ],
        [ 'dish', undefined, 'Dish' ]
      ]);
    }));


    it('NOT for business knowledge model without implementation', inject(
      function(elementRegistry, drdReplace) {

        // given
        var bkm = elementRegistry.get('bkmEmpty');

        // when
        var newElement = drdReplace.replaceElement(bkm, TABLE);

        // then
        expect(getFormalParameters(newElement)).to.be.empty;
      }
    ));


    it('NOT when replacing with nothing', inject(
      function(elementRegistry, drdReplace) {

        // given
        var bkm = elementRegistry.get('bkmLiteral');

        // when
        var newElement = drdReplace.replaceElement(bkm, {
          type: 'dmn:BusinessKnowledgeModel',
          table: false,
          expression: false
        });

        // then
        expect(newElement.businessObject.encapsulatedLogic).not.to.exist;
      }
    ));

  });


  describe('should work with text annotations', function() {

    var diagramXML = require('./textAnnotation.dmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    it('should keep references for associations', inject(
      function(elementRegistry, drdReplace) {

        // given
        var decision = elementRegistry.get('decision');

        var newElementData = {
          type: 'dmn:Decision',
          table: true,
          expression: false
        };

        // when
        drdReplace.replaceElement(decision, newElementData);

        // then
        var association = elementRegistry.filter(function(element) {
          return element.type === 'dmn:Association';
        })[0];

        var associationBo = association.businessObject;

        expect(associationBo.sourceRef.href).to.eql('#decision');
      }
    ));


    it('should undo', inject(function(elementRegistry, drdReplace, commandStack) {

      // given
      var decision = elementRegistry.get('decision');

      var newElementData = {
        type: 'dmn:Decision',
        table: true,
        expression: false
      };
      drdReplace.replaceElement(decision, newElementData);

      // when
      commandStack.undo();

      // then
      var association = elementRegistry.filter(function(element) {
        return element.type === 'dmn:Association';
      })[0];

      var associationBo = association.businessObject;

      expect(associationBo.sourceRef.href).to.eql('#decision');
    }));


    it('should redo', inject(function(elementRegistry, drdReplace, commandStack) {

      // given
      var decision = elementRegistry.get('decision');

      var newElementData = {
        type: 'dmn:Decision',
        table: true,
        expression: false
      };
      drdReplace.replaceElement(decision, newElementData);

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      var association = elementRegistry.filter(function(element) {
        return element.type === 'dmn:Association';
      })[0];

      var associationBo = association.businessObject;

      expect(associationBo.sourceRef.href).to.eql('#decision');
    }));

  });

});
