import { bootstrapModeler, inject } from 'test/helper';

import simpleStringEditXML from '../../../literal-expression.dmn';

import CoreModule from 'src/core';
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
        const decision = viewer.getDecision();

        // when
        modeling.editDecisionName('foo');

        // then
        const variable = decision.get('variable');

        expect(variable.get('name')).to.equal('foo');
      }
    ));
  });
});
