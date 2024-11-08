import { bootstrapModeler, inject } from 'test/helper';

import simpleStringEditXML from './name-change-behavior.dmn';

import CoreModule from 'src/core';
import Modeling from 'src/features/modeling';


describe('features/modeling - NameChangeBehavior', function() {

  beforeEach(bootstrapModeler(simpleStringEditXML, {
    modules: [
      CoreModule,
      Modeling
    ],
  }));


  describe('should update variable name when label is changed', function() {

    it('<do>', inject(
      function(modeling, elementRegistry) {

        // given
        const decision = elementRegistry.get('season'),
              bo = decision.businessObject,
              variable = bo.variable;

        // when
        modeling.updateLabel(decision,'foo');

        // then
        expect(variable.get('name')).to.equal('foo');
      }
    ));


    it('<undo>', inject(function(modeling, elementRegistry, commandStack) {

      // given
      const decision = elementRegistry.get('season'),
            bo = decision.businessObject,
            variable = bo.variable;
      modeling.updateLabel(decision,'foo');

      // when
      commandStack.undo();

      // then
      expect(variable.get('name')).to.equal('season');
    }));


    it('<redo>', inject(function(modeling, elementRegistry, commandStack) {

      // given
      const decision = elementRegistry.get('season'),
            bo = decision.businessObject,
            variable = bo.variable;
      modeling.updateLabel(decision,'foo');

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(variable.get('name')).to.equal('foo');
    }));
  });


  describe('should update variable name when element name is changed', function() {


    it('<do>', inject(
      function(modeling, elementRegistry) {

        // given
        const decision = elementRegistry.get('season'),
              bo = decision.businessObject,
              variable = bo.variable;

        // when
        modeling.updateProperties(decision, { name: 'foo' });

        // then
        expect(variable.get('name')).to.equal('foo');
      }
    ));


    it('<undo>', inject(function(modeling, elementRegistry, commandStack) {

      // given
      const decision = elementRegistry.get('season'),
            bo = decision.businessObject,
            variable = bo.variable;
      modeling.updateProperties(decision, { name: 'foo' });

      // when
      commandStack.undo();

      // then
      expect(variable.get('name')).to.equal('season');
    }));


    it('<redo>', inject(function(modeling, elementRegistry, commandStack) {

      // given
      const decision = elementRegistry.get('season'),
            bo = decision.businessObject,
            variable = bo.variable;
      modeling.updateProperties(decision, { name: 'foo' });

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expect(variable.get('name')).to.equal('foo');
    }));
  });
});
