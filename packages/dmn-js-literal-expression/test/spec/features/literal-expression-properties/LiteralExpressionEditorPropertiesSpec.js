import { bootstrapModeler, inject } from 'test/helper';

import { triggerChangeEvent, triggerInputEvent }
  from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import LiteralExpressionPropertiesEditorModule
  from 'lib/features/literal-expression-properties/editor';

import ModelingModule from 'lib/features/modeling';


describe('literal expression properties editor', function() {

  beforeEach(bootstrapModeler(literalExpressionXML, {
    modules: [
      LiteralExpressionPropertiesEditorModule,
      ModelingModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {

    // then
    expect(domQuery('.literal-expression-properties', testContainer)).to.exist;
  });


  it('should edit variable name', inject(function(viewer) {

    // given
    const input = domQuery('.input', testContainer);

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(viewer._decision.variable.name).to.equal('foo');
  }));


  it('should edit variable type', inject(function(viewer) {

    // given
    const select = domQuery.all('.select', testContainer)[0];

    // when
    triggerChangeEvent(select, 'boolean');

    // then
    expect(viewer._decision.variable.typeRef).to.equal('boolean');
  }));


  it('should remove variable type', inject(function(viewer) {

    // given
    const select = domQuery.all('.select', testContainer)[0];

    triggerChangeEvent(select, 'boolean');

    // when
    triggerChangeEvent(select, 'none');

    // then
    expect(viewer._decision.variable.typeRef).to.not.exist;
  }));


  it('should edit expression language', inject(function(viewer) {

    // given
    const select = domQuery.all('.select', testContainer)[1];

    // when
    triggerChangeEvent(select, 'python');

    // then
    expect(viewer._decision.literalExpression.expressionLanguage).to.equal('python');
  }));


  it('should remove expression language', inject(function(viewer) {

    // given
    const select = domQuery.all('.select', testContainer)[1];

    triggerChangeEvent(select, 'python');

    // when
    triggerChangeEvent(select, 'none');

    // then
    expect(viewer._decision.literalExpression.expressionLanguage).to.not.exist;
  }));

});