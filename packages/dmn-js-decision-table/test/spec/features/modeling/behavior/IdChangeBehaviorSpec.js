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

    const { drgElements } = definitions;

    const dishDecision = drgElements.filter(
      drgElement => drgElement.id === 'dish-decision'
    )[0];

    const seasonDecision = drgElements.filter(
      drgElement => drgElement.id === 'season'
    )[0];

    const dmnJS = getDmnJS();

    dmnJS._viewers.decisionTable.open(seasonDecision, () => {

      // when
      modeling.editDecisionTableId('foo');

      // then
      expect(dishDecision.informationRequirement[0].requiredDecision.href).to.eql('#foo');
      expect(dishDecision.extensionElements.values[1].source).to.eql('foo');
    });
  }));


  it('should update IDs on decision ID change', inject(function(modeling, sheet) {

    // given
    const root = sheet.getRoot(),
          decisionTable = root.businessObject;

    const decision = decisionTable.$parent;

    const definitions = decision.$parent;

    const {
      artifacts,
      drgElements
    } = definitions;

    const dishDecision = drgElements.filter(
      drgElement => drgElement.id === 'dish-decision'
    )[0];

    const association = artifacts.filter(
      element => element.id === 'Association'
    )[0];

    const dmnJS = getDmnJS();

    dmnJS._viewers.decisionTable.open(dishDecision, () => {

      // when
      modeling.editDecisionTableId('foo');

      // then
      expect(association.sourceRef.href).to.eql('#foo');
      expect(association.extensionElements.values[0].source).to.eql('foo');
    });
  }));

});