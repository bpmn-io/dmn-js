import { bootstrapViewer } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import DecisionPropertiesModule from 'lib/features/decision-properties';


describe('decision properties', function() {

  beforeEach(bootstrapViewer(literalExpressionXML, {
    modules: [
      DecisionPropertiesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {

    // then
    expect(domQuery('.decision-properties', testContainer)).to.exist;
  });

});