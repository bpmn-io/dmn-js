import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import { bootstrapViewer } from 'test/helper';

import literalExpressionXML from '../../literal-expression.dmn';


describe('features/element-properties', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(bootstrapViewer(literalExpressionXML));


  it('should render', function() {

    // then
    expect(domQuery('.dmn-boxed-expression-header .element-properties', testContainer))
      .to.exist;
  });


  it('should display name', function() {

    // when
    const name = domQuery('.element-name', testContainer);

    // then
    expect(name.textContent).to.equal('Season');
  });

});
