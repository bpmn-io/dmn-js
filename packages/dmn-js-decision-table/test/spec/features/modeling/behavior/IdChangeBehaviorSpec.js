import { bootstrapModeler, getDmnJS, inject } from 'test/helper';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';

import diagramXML from './two-decision-tables.dmn';

describe('IdChangeBehavior', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  it('should update IDs on decision ID change', inject(function(modeling, sheet) {

    // given
    const root = sheet.getRoot(),
          decisionTable = root.businessObject;

    const decision = decisionTable.$parent;

    const definitions = decision.$parent;

    const { drgElement } = definitions;

    const dishDecision = drgElement.filter(
      drgElement => drgElement.id === 'dish-decision'
    )[0];

    const seasonDecision = drgElement.filter(
      drgElement => drgElement.id === 'season'
    )[0];

    const dmnJS = getDmnJS();

    dmnJS._viewers.decisionTable.open(seasonDecision, () => {

      // when
      modeling.editDecisionTableId('foo');

      // then
      expect(dishDecision.informationRequirement[0].requiredDecision.href).to.eql('#foo');
    });
  }));

});