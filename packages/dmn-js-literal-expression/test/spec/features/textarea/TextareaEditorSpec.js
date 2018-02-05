import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import { queryEditor } from 'dmn-js-decision-table/test/util/EditorUtil';

import { triggerInputEvent } from 'dmn-js-decision-table/test/util/EventUtil';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import TextareaEditorModule
  from 'lib/features/textarea/editor';


describe('textarea editor', function() {

  beforeEach(bootstrapModeler(literalExpressionXML, {
    modules: [
      TextareaEditorModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {

    // then
    expect(domQuery('.textarea', testContainer)).to.exist;
  });


  it('should edit literal expression text', inject(function(viewer) {

    // given
    const editor = queryEditor('.textarea', testContainer);

    editor.focus();

    // when
    triggerInputEvent(editor, 'foo');

    // then
    expect(viewer._decision.literalExpression.text).to.equal('foo');
  }));

});