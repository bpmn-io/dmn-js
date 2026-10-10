import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import {
  bootstrapModeler,
  getBoxedExpressionViewer,
  getDmnJS
} from 'test/helper';

import mixedXML from '../../mixed-expressions.dmn';


describe('features/element-logic', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(mixedXML));

  async function openElement(id) {
    const dmnJS = getDmnJS();

    await dmnJS.open(dmnJS.getViews().find(view => view.element.id === id));
  }

  function queryBody(selector) {
    return domQuery('.dmn-boxed-expression-body ' + selector, testContainer);
  }


  describe('switching between expressions', function() {

    beforeEach(async function() {
      await openElement('literalDecision');
    });


    it('should display literal expression', function() {

      // then
      expect(queryBody('.textarea').textContent).to.equal('"foo"');
    });


    it('should display decision table after literal expression', async function() {

      // when
      await openElement('tableDecision');

      // then
      expect(queryBody('.tjs-table')).to.exist;
      expect(queryBody('.textarea')).not.to.exist;
    });


    it('should display literal expression after decision table', async function() {

      // given
      await openElement('tableDecision');

      // when
      await openElement('literalDecision');

      // then
      expect(queryBody('.textarea')).to.exist;
      expect(queryBody('.tjs-table')).not.to.exist;
    });


    it('should display literal expression of BKM after decision table', async function() {

      // given
      await openElement('tableDecision');

      // when
      await openElement('bkm');

      // then
      expect(queryBody('.function-definition-body .textarea').textContent)
        .to.equal('age');
      expect(queryBody('.tjs-table')).not.to.exist;
    });


    it('should display root element of opened view', async function() {

      // when
      await openElement('tableDecision');

      // then
      expect(domQuery('.element-name', testContainer).textContent)
        .to.equal('Table decision');
    });


    it('should use single viewer', async function() {

      // given
      const viewer = getBoxedExpressionViewer();

      // when
      await openElement('tableDecision');

      // then
      expect(getBoxedExpressionViewer()).to.equal(viewer);
    });


    it('should clear undo history', async function() {

      // given
      const viewer = getBoxedExpressionViewer();

      viewer.get('literalExpression').setText(
        viewer.getRootElement().decisionLogic, '"bar"'
      );

      // when
      await openElement('tableDecision');

      // then
      expect(viewer.get('commandStack').canUndo()).to.be.false;
    });

  });

});
