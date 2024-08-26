import { bootstrapModeler, inject } from 'test/helper';

import simpleStringEditXML from './name-change-behavior.dmn';

import CoreModule from 'src/core';
import Modeling from 'src/features/modeling';


describe('NameChangeBehavior', function() {

  describe('with label change', function() {

    beforeEach(bootstrapModeler(simpleStringEditXML, {
      modules: [
        CoreModule,
        Modeling
      ],
    }));


    it('should update variable name when label is changed', inject(
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
  });
});
