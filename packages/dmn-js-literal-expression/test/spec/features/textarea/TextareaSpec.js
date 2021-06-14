import { bootstrapViewer } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import literalExpressionXML from '../../literal-expression.dmn';

import CoreModule from 'src/core';
import TextareaModule
  from 'src/features/textarea';


describe('textarea', function() {

  beforeEach(bootstrapViewer(literalExpressionXML, {
    modules: [
      CoreModule,
      TextareaModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render', function() {

    // then
    const textarea = domQuery('.textarea', testContainer);

    expect(textarea).to.exist;
    expect(textarea.textContent).to.eql('calendar.getSeason(date)');
  });

});
