import { bootstrapModeler, inject } from 'test/helper';

import simpleStringEditXML from '../../literal-expression.dmn';

import CoreModule from 'src/core';
import Modeling from 'src/features/modeling';


describe('Modeling', function() {

  beforeEach(bootstrapModeler(simpleStringEditXML, {
    modules: [
      CoreModule,
      Modeling
    ],
  }));


  it('should edit decision name', inject(function(modeling, viewer) {

    // given
    const decision = viewer.getRootElement();

    // when
    modeling.updateProperties(decision, { name: 'foo' });

    // then
    expect(viewer.getRootElement().name).to.equal('foo');
  }));


  it('should edit decision id', inject(function(modeling, viewer) {

    // given
    const decision = viewer.getRootElement();

    // when
    modeling.updateProperties(decision, { id: 'foo' });

    // then
    expect(viewer.getRootElement().id).to.equal('foo');
  }));


  it('should edit literal expression text', inject(function(modeling, viewer) {

    // when
    modeling.updateProperties(viewer.getRootElement().decisionLogic, { text: 'foo' });

    // then
    expect(viewer.getRootElement().decisionLogic.text).to.equal('foo');
  }));


  it('should edit expression language', inject(function(modeling, viewer) {

    // given
    const expression = viewer.getRootElement().decisionLogic;

    // when
    modeling.updateProperties(expression, { expressionLanguage: 'foo' });

    // then
    expect(viewer.getRootElement().decisionLogic.expressionLanguage)
      .to.equal('foo');
  }));


  it('should edit variable name', inject(function(modeling, viewer) {

    // given
    const variable = viewer.getRootElement().variable;

    // when
    modeling.updateProperties(variable, { name: 'foo' });

    // then
    expect(viewer.getRootElement().variable.name).to.equal('foo');
  }));


  it('should edit variable type', inject(function(modeling, viewer) {

    // given
    const variable = viewer.getRootElement().variable;

    // when
    modeling.updateProperties(variable, { typeRef: 'foo' });

    // then
    expect(viewer.getRootElement().variable.typeRef).to.equal('foo');
  }));

});