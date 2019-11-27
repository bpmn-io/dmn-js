import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerInputEvent,
  triggerInputSelectChange
} from 'dmn-js-shared/test/util/EventUtil';

import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

import {
  query as domQuery
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import LiteralExpressionPropertiesEditorModule
  from 'src/features/literal-expression-properties/editor';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';


describe('literal expression properties editor', function() {

  beforeEach(bootstrapModeler(literalExpressionXML, {
    modules: [
      CoreModule,
      LiteralExpressionPropertiesEditorModule,
      ExpressionLanguagesModule,
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
    const input = domQuery('.variable-name-input', testContainer);

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(viewer.getDecision().variable.name).to.equal('foo');
  }));


  it('should edit variable type - input', inject(function(viewer) {

    // given
    const inputSelect = domQuery('.variable-type-select', testContainer);

    const input = domQuery('.dms-input', inputSelect);

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(viewer.getDecision().variable.typeRef).to.equal('foo');
  }));


  it('should edit variable type - select', inject(function(viewer) {

    // given
    const inputSelect = domQuery('.variable-type-select', testContainer);

    // when
    triggerInputSelectChange(inputSelect, 'boolean', testContainer);

    // then
    expect(viewer.getDecision().variable.typeRef).to.equal('boolean');
  }));


  it('should remove variable type', inject(function(viewer) {

    // given
    const inputSelect = domQuery('.variable-type-select', testContainer);

    triggerInputSelectChange(inputSelect, 'boolean', testContainer);

    const input = domQuery('.dms-input', inputSelect);

    // when
    triggerInputEvent(input, '');

    // then
    expect(viewer.getDecision().variable.typeRef).to.not.exist;
  }));


  it('should edit expression language - input', inject(function(viewer) {

    // given
    const inputSelect = domQuery('.expression-language-select', testContainer);

    const input = domQuery('.dms-input', inputSelect);

    // when
    triggerInputEvent(input, 'foo');

    // then
    expect(viewer.getDecision().literalExpression.expressionLanguage)
      .to.equal('foo');
  }));


  it('should edit expression language - select', inject(function(viewer) {

    // given
    const inputSelect = domQuery('.expression-language-select', testContainer);

    // when
    triggerInputSelectChange(inputSelect, 'javascript', testContainer);

    // then
    expect(viewer.getDecision().literalExpression.expressionLanguage)
      .to.equal('javascript');
  }));


  it('should remove expression language', inject(function(viewer) {

    // given
    const inputSelect = domQuery('.expression-language-select', testContainer);

    triggerInputSelectChange(inputSelect, 'python', testContainer);

    const input = domQuery('.dms-input', inputSelect);

    // when
    triggerInputEvent(input, '');

    // then
    expect(viewer.getDecision().literalExpression.expressionLanguage)
      .to.not.exist;
  }));

});