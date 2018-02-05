import { bootstrapModeler, inject } from 'test/helper';

import simpleStringEditXML from '../../literal-expression.dmn';

import Modeling from 'lib/features/modeling';


describe('Modeling', function() {

  beforeEach(bootstrapModeler(simpleStringEditXML, {
    modules: [
      Modeling
    ],
  }));


  it('should edit decision name', inject(function(modeling, viewer) {

    // when
    modeling.editDecisionName('foo');

    // then
    expect(viewer._decision.name).to.equal('foo');
  }));


  it('should edit decision id', inject(function(modeling, viewer) {

    // when
    modeling.editDecisionId('foo');

    // then
    expect(viewer._decision.id).to.equal('foo');
  }));


  it('should edit literal expression text', inject(function(modeling, viewer) {

    // when
    modeling.editLiteralExpressionText('foo');

    // then
    expect(viewer._decision.literalExpression.text).to.equal('foo');
  }));


  it('should edit expression language', inject(function(modeling, viewer) {

    // when
    modeling.editExpressionLanguage('foo');

    // then
    expect(viewer._decision.literalExpression.expressionLanguage).to.equal('foo');
  }));


  it('should edit variable name', inject(function(modeling, viewer) {

    // when
    modeling.editVariableName('foo');

    // then
    expect(viewer._decision.variable.name).to.equal('foo');
  }));


  it('should edit variable type', inject(function(modeling, viewer) {

    // when
    modeling.editVariableType('foo');

    // then
    expect(viewer._decision.variable.typeRef).to.equal('foo');
  }));

});