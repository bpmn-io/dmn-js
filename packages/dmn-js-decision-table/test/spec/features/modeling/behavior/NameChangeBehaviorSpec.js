import { bootstrapModeler, inject } from 'test/helper';

import decisionTableXML from './name-change-behavior.dmn';

import CoreModule from 'src/core';
import Modeling from 'src/features/modeling';


describe('features/modeling/behavior - NameChangeBehavior', function() {

  describe('with existing variable', function() {

    beforeEach(bootstrapModeler(decisionTableXML, {
      modules: [
        CoreModule,
        Modeling
      ],
    }));

    describe('should update variable name when element name is changed', function() {


      it('<do>', inject(
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


      it('<undo>', inject(
        function(modeling, sheet, commandStack) {

          // given
          const root = sheet.getRoot(),
                decisionTable = root.businessObject;

          const decision = decisionTable.$parent;
          modeling.editDecisionTableName('foo');

          // when
          commandStack.undo();

          // then
          const variable = decision.get('variable');

          expect(variable.get('name')).to.equal('Season');
        }
      ));


      it('<redo>', inject(
        function(modeling, sheet, commandStack) {

          // given
          const root = sheet.getRoot(),
                decisionTable = root.businessObject;

          const decision = decisionTable.$parent;
          modeling.editDecisionTableName('foo');

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const variable = decision.get('variable');

          expect(variable.get('name')).to.equal('foo');
        }
      ));
    });
  });
});
