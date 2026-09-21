import { expect } from 'chai';

import { bootstrapModeler, inject } from 'test/helper';

import functionDefinitionXML from '../function-definition/function-definition.dmn';
import literalExpressionXML from '../../literal-expression.dmn';


describe('ElementVariableEditor', function() {

  describe('business knowledge model', function() {

    beforeEach(bootstrapModeler(functionDefinitionXML));


    describe('#getType', function() {

      it('should read type from function body, not variable', inject(
        function(elementVariable) {

          // when
          const type = elementVariable.getType();

          // then
          expect(type).to.equal('Any');
        }
      ));
    });


    describe('#setType', function() {

      it('should set type on function body', inject(
        function(elementVariable, viewer, functionDefinition) {

          // given
          const bkm = viewer.getRootElement();
          const encapsulatedLogic = bkm.get('encapsulatedLogic');

          // when
          elementVariable.setType('number');

          // then
          const body = functionDefinition.getBody(encapsulatedLogic);

          expect(body.get('typeRef')).to.equal('number');
        }
      ));


      it('should not write type to variable', inject(
        function(elementVariable, viewer) {

          // given
          const bkm = viewer.getRootElement();

          // when
          elementVariable.setType('number');

          // then
          const variable = bkm.get('variable');

          expect(variable.get('typeRef')).to.equal('string');
        }
      ));
    });
  });


  describe('decision', function() {

    beforeEach(bootstrapModeler(literalExpressionXML));


    describe('#getType', function() {

      it('should read type from variable', inject(
        function(elementVariable) {

          // when
          const type = elementVariable.getType();

          // then
          expect(type).to.equal('string');
        }
      ));


      it('should default to Any when variable has no type', inject(
        function(elementVariable, viewer) {

          // given
          const decision = viewer.getRootElement();
          const variable = decision.get('variable');

          delete variable.typeRef;

          // when
          const type = elementVariable.getType();

          // then
          expect(type).to.equal('Any');
        }
      ));
    });


    describe('#setType', function() {

      it('should set type on variable', inject(
        function(elementVariable, viewer) {

          // given
          const decision = viewer.getRootElement();

          // when
          elementVariable.setType('number');

          // then
          const variable = decision.get('variable');

          expect(variable.get('typeRef')).to.equal('number');
        }
      ));
    });
  });
});
