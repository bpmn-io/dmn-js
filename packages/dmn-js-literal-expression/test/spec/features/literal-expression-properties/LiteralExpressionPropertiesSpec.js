import { bootstrapViewer } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import CoreModule from 'src/core';
import LiteralExpressionPropertiesModule
  from 'src/features/literal-expression-properties';


describe('literal expression properties', function() {

  beforeEach(bootstrapViewer(literalExpressionXML, {
    modules: [
      CoreModule,
      LiteralExpressionPropertiesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {

    // then
    expect(domQuery('.literal-expression-properties', testContainer)).to.exist;
  });

});