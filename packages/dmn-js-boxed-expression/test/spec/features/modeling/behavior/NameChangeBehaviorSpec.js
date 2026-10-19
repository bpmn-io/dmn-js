import { expect } from 'chai';
import { bootstrapModeler, inject } from 'test/helper';

import simpleStringEditXML from '../../../literal-expression.dmn';
import noVariableXML from '../../../no-variable.dmn';
import decisionTableXML from '../../../simple.dmn';

import CoreModule from 'src/core';
import DecisionTableModule from 'src/features/decision-table';
import Modeling from 'src/features/modeling';


describe('NameChangeBehavior', function() {

  describe('with existing variable', function() {

    beforeEach(bootstrapModeler(simpleStringEditXML, {
      modules: [
        CoreModule,
        Modeling
      ],
    }));


    it('should update variable name when element name is changed', inject(
      function(modeling, viewer) {

        // given
        const decision = viewer.getRootElement();

        // when
        modeling.updateProperties(decision, { name: 'foo' });

        // then
        const variable = decision.get('variable');

        expect(variable.get('name')).to.equal('foo');
      }
    ));


    it('should undo element and variable name change at once', inject(
      function(commandStack, modeling, viewer) {

        // given
        const decision = viewer.getRootElement();
        const name = decision.get('name');
        const variableName = decision.get('variable').get('name');

        modeling.updateProperties(decision, { name: 'foo' });

        // when
        commandStack.undo();

        // then
        expect(decision.get('name')).to.equal(name);
        expect(decision.get('variable').get('name')).to.equal(variableName);
      }
    ));


    it('should update element name when variable name is changed', inject(
      function(modeling, viewer) {

        // given
        const decision = viewer.getRootElement();
        const variable = decision.get('variable');

        // when
        modeling.updateProperties(variable, { name: 'foo' });

        // then
        expect(decision.get('name')).to.equal('foo');
      }
    ));
  });


  describe('with decision table', function() {

    beforeEach(bootstrapModeler(decisionTableXML, {
      modules: [
        DecisionTableModule,
        Modeling
      ],
    }));


    it('should update name of table element', inject(
      function(elementRegistry, modeling) {

        // given
        const output = elementRegistry.get('output1');

        // when
        modeling.updateProperties(output, { name: 'foo' });

        // then
        expect(output.businessObject.get('name')).to.equal('foo');
      }
    ));
  });


  describe('without variable', function() {

    beforeEach(bootstrapModeler(noVariableXML, {
      modules: [
        CoreModule,
        Modeling
      ],
    }));


    it('should NOT create variable if missing', inject(
      function(modeling, viewer) {

        // given
        const decision = viewer.getRootElement();

        // when
        modeling.updateProperties(decision, { name: 'foo' });

        // then
        const variable = decision.get('variable');

        expect(variable).not.to.exist;
      }
    ));
  });
});
