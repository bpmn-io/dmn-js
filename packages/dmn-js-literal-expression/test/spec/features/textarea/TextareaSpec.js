import { bootstrapViewer } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import TextareaModule
  from 'src/features/textarea';


describe('textarea', function() {

  beforeEach(bootstrapViewer(literalExpressionXML, {
    modules: [
      TextareaModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {

    // then
    expect(domQuery('.textarea', testContainer)).to.exist;
  });

});