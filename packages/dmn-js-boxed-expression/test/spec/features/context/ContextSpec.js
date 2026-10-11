import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import axe from 'axe-core';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import { bootstrapViewer } from 'test/helper';

import { translateModule } from 'dmn-js-shared/test/util/TranslateUtil';

import contextXML from '../../context-two-tables.dmn';
import contextInFunctionXML from '../../context-in-function.dmn';
import emptyEntryXML from '../../context-empty-entry.dmn';
import nestedXML from '../../context-nested.dmn';


describe('features/context', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function getEntries(container = testContainer) {
    return Array.from(domQueryAll('.context-entry', container));
  }

  function getVariableText(entry) {
    return domQuery('.context-entry-variable', entry).textContent;
  }


  describe('entries', function() {

    beforeEach(bootstrapViewer(contextXML));


    it('should render entry for each context entry', function() {

      // then
      expect(getEntries()).to.have.length(3);
    });


    it('should render variable name and type', function() {

      // then
      expect(getEntries().map(getVariableText)).to.eql([
        'discount: number',
        'shipping: number',
        ''
      ]);
    });


    it('should render value of entry', function() {

      // then
      const [ discount, shipping, result ] = getEntries();

      expect(domQuery('.tjs-table', discount)).to.exist;
      expect(domQuery('.tjs-table', shipping)).to.exist;
      expect(domQuery('.textarea', result).textContent).to.eql('shipping - discount');
    });


    it('should render all tables', function() {

      // then
      expect(domQueryAll('.dmn-decision-table-container', testContainer))
        .to.have.length(2);
    });


    it('should mark result entry', function() {

      // then
      const [ , , result ] = getEntries();

      expect(domQuery('.context-entry-variable', result).title).to.eql('Result');
    });

  });


  describe('nested context', function() {

    beforeEach(bootstrapViewer(nestedXML));


    it('should render nested context', function() {

      // then
      expect(domQueryAll('.context .context', testContainer)).to.have.length(1);
    });


    it('should render entries of nested context', function() {

      // given
      const nested = domQuery('.context .context', testContainer);

      // then
      expect(getEntries(nested)).to.have.length(2);
    });

  });


  describe('in function', function() {

    beforeEach(bootstrapViewer(contextInFunctionXML));


    it('should render context as function body', function() {

      // then
      expect(domQuery('.function-definition-body .context', testContainer)).to.exist;
    });


    it('should render table of context', function() {

      // then
      expect(domQuery('.function-definition-body .tjs-table', testContainer)).to.exist;
    });

  });


  describe('incomplete entries', function() {

    beforeEach(bootstrapViewer(emptyEntryXML));


    it('should render unnamed variable', function() {

      // then
      expect(getVariableText(getEntries()[0])).to.eql('<unnamed>');
    });


    it('should render entry without value', function() {

      // then
      const [ , noValue ] = getEntries();

      expect(domQuery('.context-entry-value', noValue).children).to.have.length(0);
    });

  });


  describe('translation', function() {

    beforeEach(bootstrapViewer(emptyEntryXML, {
      additionalModules: [ translateModule ]
    }));


    it('should translate unnamed variable', function() {

      // then
      expect(getVariableText(getEntries()[0])).to.eql('tr(<unnamed>)');
    });


    it('should translate variable type', function() {

      // then
      expect(getVariableText(getEntries()[1])).to.eql('empty: tr(string)');
    });

  });


  describe('accessibility', function() {

    beforeEach(bootstrapViewer(contextXML));


    it('should report no issues', async function() {

      // when
      const results = await axe.run(testContainer, {
        rules: {
          'empty-table-header': { enabled: false },
          'scrollable-region-focusable': { enabled: false }
        }
      });

      // then
      expect(results.passes).to.be.not.empty;
      expect(results.violations).to.be.empty;
    });

  });

});
