import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import { translateModule } from 'dmn-js-shared/test/util/TranslateUtil';

import { bootstrapViewer } from 'test/helper';

import literalExpressionXML from '../../literal-expression.dmn';
import noVariableXML from '../../no-variable.dmn';
import noTypeRefXML from './no-type-ref.dmn';


describe('features/element-variable', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function queryText(selector) {
    return domQuery(selector, testContainer).textContent;
  }


  describe('basic', function() {

    beforeEach(bootstrapViewer(literalExpressionXML));


    it('should render', function() {

      // then
      expect(domQuery('.dmn-boxed-expression-footer .element-variable', testContainer))
        .to.exist;
    });


    it('should display variable name', function() {

      // then
      expect(queryText('.element-variable-name')).to.contain('season');
    });


    it('should display result type', function() {

      // then
      expect(queryText('.element-variable-type')).to.contain('Result type');
      expect(queryText('.element-variable-type')).to.contain('string');
    });

  });


  describe('translation', function() {

    beforeEach(bootstrapViewer(literalExpressionXML, {
      additionalModules: [ translateModule ]
    }));


    it('should translate title', function() {

      // then
      expect(queryText('.element-variable h2')).to.equal('tr(Result)');
    });


    it('should translate result type', function() {

      // then
      expect(queryText('.element-variable-type')).to.contain('tr(string)');
    });

  });


  describe('no type reference', function() {

    beforeEach(bootstrapViewer(noTypeRefXML));


    it('should display <Any> as result type', function() {

      // then
      expect(queryText('.element-variable-type')).to.contain('Any');
    });

  });


  describe('no variable', function() {

    beforeEach(bootstrapViewer(noVariableXML));


    it('should display name of decision', function() {

      // then
      expect(queryText('.element-variable-name')).to.contain('Season');
    });

  });

});
