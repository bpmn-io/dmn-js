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

    // when
    modeling.editDecisionName('foo');

    // then
    expect(viewer.getDecision().name).to.equal('foo');
  }));


  it('should edit decision id', inject(function(modeling, viewer) {

    // when
    modeling.editDecisionId('foo');

    // then
    expect(viewer.getDecision().id).to.equal('foo');
  }));


  it('should edit literal expression text', inject(function(modeling, viewer) {

    // when
    modeling.editLiteralExpressionText('foo');

    // then
    expect(viewer.getDecision().decisionLogic.text).to.equal('foo');
  }));


  it('should edit expression language', inject(function(modeling, viewer) {

    // when
    modeling.editExpressionLanguage('foo');

    // then
    expect(viewer.getDecision().decisionLogic.expressionLanguage)
      .to.equal('foo');
  }));


  it('should edit variable name', inject(function(modeling, viewer) {

    // when
    modeling.editVariableName('foo');

    // then
    expect(viewer.getDecision().variable.name).to.equal('foo');
  }));


  it('should edit variable type', inject(function(modeling, viewer) {

    // when
    modeling.editVariableType('foo');

    // then
    expect(viewer.getDecision().variable.typeRef).to.equal('foo');
  }));

});