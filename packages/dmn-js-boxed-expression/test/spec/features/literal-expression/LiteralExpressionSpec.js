import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import { bootstrapViewer } from 'test/helper';

import literalExpressionXML from '../../literal-expression.dmn';
import bkmXML from '../../bkm-literal-expression.dmn';


describe('features/literal-expression', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('decision', function() {

    beforeEach(bootstrapViewer(literalExpressionXML));


    it('should render', function() {

      // when
      const textarea = domQuery('.dmn-boxed-expression-body .textarea', testContainer);

      // then
      expect(textarea.textContent).to.eql('calendar.getSeason(date)');
    });

  });


  describe('business knowledge model', function() {

    beforeEach(bootstrapViewer(bkmXML));


    it('should render', function() {

      // when
      const textarea = domQuery('.function-definition-body .textarea', testContainer);

      // then
      expect(textarea.textContent).to.eql('calendar.getSeason(date)');
    });

  });

});
