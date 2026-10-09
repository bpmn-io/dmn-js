import { expect } from 'chai';

import {
  bootstrapModeler,
  getBoxedExpressionViewer,
  getDmnJS
} from 'test/helper';

import diagramXML from './two-decision-tables.dmn';

describe('IdChangeBehavior', function() {

  beforeEach(bootstrapModeler(diagramXML));


  function getDrgElement(id) {
    return getDmnJS().getDefinitions().drgElement.find(element => element.id === id);
  }

  async function openDecision(decision) {
    const dmnJS = getDmnJS();

    const view = dmnJS.getViews().find(view => view.element === decision);

    await dmnJS.open(view);

    return getBoxedExpressionViewer();
  }


  it('should update requirement refs on decision ID change', async function() {

    // given
    const dishDecision = getDrgElement('dish-decision'),
          seasonDecision = getDrgElement('season');

    const viewer = await openDecision(seasonDecision);

    // when
    viewer.get('modeling').updateProperties(seasonDecision, { id: 'foo' });

    // then
    expect(dishDecision.informationRequirement[0].requiredDecision.href).to.eql('#foo');
  });


  it('should update association refs on decision ID change', async function() {

    // given
    const dishDecision = getDrgElement('dish-decision');

    const association = getDmnJS().getDefinitions().artifact.find(
      element => element.id === 'Association'
    );

    const viewer = await openDecision(dishDecision);

    // when
    viewer.get('modeling').updateProperties(dishDecision, { id: 'foo' });

    // then
    expect(association.sourceRef.href).to.eql('#foo');
  });

});
