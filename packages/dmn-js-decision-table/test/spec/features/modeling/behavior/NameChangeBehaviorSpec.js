import { bootstrapModeler, inject } from 'test/helper';

import decisionTableXML from './name-change-behavior.dmn';

import CoreModule from 'src/core';
import Modeling from 'src/features/modeling';


describe('NameChangeBehavior', function() {

  describe('with existing variable', function() {

    beforeEach(bootstrapModeler(decisionTableXML, {
      modules: [
        CoreModule,
        Modeling
      ],
    }));


    it('should update variable name when element name is changed', inject(
      function(modeling, sheet) {

        // given
        const root = sheet.getRoot(),
              decisionTable = root.businessObject;

        const decision = decisionTable.$parent;

        // when
        modeling.editDecisionTableName('foo');

        // then
        const variable = decision.get('variable');

        expect(variable.get('name')).to.equal('foo');
      }
    ));
  });
});
