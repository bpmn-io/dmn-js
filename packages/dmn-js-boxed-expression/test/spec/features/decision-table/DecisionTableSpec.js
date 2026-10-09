import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import {
  bootstrapModeler,
  bootstrapViewer
} from 'test/TestHelper';

import decisionXML from '../../simple.dmn';
import bkmXML from '../../bkm-decision-table.dmn';


describe('features/decision-table', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('decision', function() {

    beforeEach(bootstrapViewer(decisionXML));


    it('should render table in body', function() {

      // then
      expect(domQuery('.dmn-boxed-expression-body .tjs-table', testContainer)).to.exist;
    });


    it('should render rules', function() {

      // when
      const rules = domQueryAll('.tjs-table tbody tr', testContainer);

      // then
      expect(rules).to.have.length(4);
    });


    it('should render hit policy', function() {

      // then
      expect(domQuery('.decision-table-properties .hit-policy', testContainer)).to.exist;
    });


    it('should render name in header', function() {

      // when
      const name = domQuery('.dmn-boxed-expression-header .element-name', testContainer);

      // then
      expect(name.textContent).to.eql('Check Order');
    });

  });


  describe('business knowledge model', function() {

    beforeEach(bootstrapViewer(bkmXML));


    it('should render table in function body', function() {

      // then
      expect(domQuery('.function-definition-body .tjs-table', testContainer)).to.exist;
    });


    it('should render formal parameters', function() {

      // when
      const parameters = domQuery('.function-definition-parameters', testContainer);

      // then
      expect(parameters.textContent).to.contain('age: number');
    });

  });


  describe('editor', function() {

    beforeEach(bootstrapModeler(decisionXML));


    it('should render add rule', function() {

      // then
      expect(domQuery('.tjs-table tfoot .add-rule', testContainer)).to.exist;
    });


    it('should render editable hit policy', function() {

      // then
      expect(domQuery('.hit-policy-edit-policy-select', testContainer)).to.exist;
    });

  });

});
