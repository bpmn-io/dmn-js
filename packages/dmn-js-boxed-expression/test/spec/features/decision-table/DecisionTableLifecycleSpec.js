import { expect } from 'chai';

import * as sinon from 'sinon';

import TestContainer from 'mocha-test-container-support';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import {
  bootstrapModeler,
  getBoxedExpressionViewer,
  getDmnJS,
  inject
} from 'test/TestHelper';

import { triggerClick } from 'dmn-js-shared/test/util/EventUtil';

import twoDecisionsXML from '../../two-decisions.dmn';


describe('features/decision-table - lifecycle', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(twoDecisionsXML));


  function editFirstCell(modeling, elementRegistry) {
    modeling.editCell(elementRegistry.get('inputEntry1'), '"platinum"');
  }


  describe('#clear', function() {

    it('should unmount table', function() {

      // when
      getBoxedExpressionViewer().clear();

      // then
      expect(domQueryAll('.tjs-table', testContainer)).to.have.length(0);
    });


    it('should clear undo history', inject(function(commandStack, modeling, elementRegistry) {

      // given
      editFirstCell(modeling, elementRegistry);

      // when
      getBoxedExpressionViewer().clear();

      // then
      expect(commandStack.canUndo()).to.be.false;
    }));


    it('should clear element registry', inject(function(elementRegistry) {

      // when
      getBoxedExpressionViewer().clear();

      // then
      expect(elementRegistry.getAll()).to.be.empty;
    }));


    it('should clear cell selection', inject(function(cellSelection) {

      // given
      triggerClick(domQuery('[data-element-id="inputEntry1"]', testContainer));

      expect(cellSelection.getCellSelection()).to.exist;

      // when
      getBoxedExpressionViewer().clear();

      // then
      expect(cellSelection.getCellSelection()).not.to.exist;
    }));

  });


  describe('#open', function() {

    async function openOtherDecision() {
      const dmnJS = getDmnJS();

      const otherView = dmnJS.getViews().find(view => view.element.id === 'foo');

      await dmnJS.open(otherView);

      return otherView;
    }


    it('should display single table', async function() {

      // when
      await openOtherDecision();

      // then
      expect(domQueryAll('.tjs-table', testContainer)).to.have.length(1);
    });


    it('should display table of opened decision', async function() {

      // when
      const otherView = await openOtherDecision();

      // then
      const root = getBoxedExpressionViewer().get('sheet').getRoot();

      expect(root.businessObject).to.equal(otherView.element.decisionLogic);
    });


    it('should clear undo history', async function() {

      // given
      getBoxedExpressionViewer().invoke(editFirstCell);

      // when
      await openOtherDecision();

      // then
      expect(getBoxedExpressionViewer().get('commandStack').canUndo()).to.be.false;
    });


    it('should import table once', async function() {

      // given
      const spy = sinon.spy();

      getBoxedExpressionViewer().on('root.add', spy);

      // when
      await openOtherDecision();

      // then
      expect(spy).to.have.been.calledOnce;
    });

  });


  describe('#destroy', function() {

    it('should unmount before tearing down table', function() {

      // given
      const viewer = getBoxedExpressionViewer();

      const events = [];

      viewer.on([ 'renderer.unmount', 'table.destroy', 'diagram.destroy' ], 10000, ({ type }) => {
        events.push(type);
      });

      // when
      viewer.destroy();

      // then
      expect(events).to.eql([ 'renderer.unmount', 'table.destroy', 'diagram.destroy' ]);
    });


    it('should unbind keyboard', inject(function(keyboard) {

      // given
      expect(keyboard.getBinding()).to.exist;

      // when
      getDmnJS().destroy();

      // then
      expect(keyboard.getBinding()).not.to.exist;
    }));


    it('should remove table from DOM', function() {

      // when
      getDmnJS().destroy();

      // then
      expect(domQueryAll('.tjs-table', testContainer)).to.have.length(0);
    });

  });

});
