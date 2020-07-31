import TestContainer from 'mocha-test-container-support';

import {
  bootstrapModeler,
  inject,
  getDecisionTable
} from 'test/TestHelper';

import {
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import {
  getFocusableNode,
  getNodeById
} from 'src/features/cell-selection/CellSelectionUtil';

import CoreModule from 'src/core';
import DecisionTableHead from 'src/features/decision-table-head';
import CellSelectionModule from 'src/features/cell-selection';
import DecisionRulesModule from 'src/features/decision-rules';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import PropertiesEditorModule from 'src/features/decision-table-properties/editor';
import ModelingModule from 'src/features/modeling';

import testDiagram from './cell-selection.dmn';

/* global sinon */


describe('features/cell-selection', function() {

  beforeEach(bootstrapModeler(testDiagram, {
    modules: [
      CoreModule,
      DecisionTableHead,
      PropertiesEditorModule,
      CellSelectionModule,
      DecisionRulesModule,
      DecisionRulesEditorModule,
      ModelingModule
    ]
  }));


  describe('should focus on click', function() {

    describe('decision properties', function() {

      it('name', inject(function(cellSelection) {

        // when
        click('__decisionProperties_name');

        // then
        expect(hasFocus('__decisionProperties_name')).to.be.true;
      }));

    });


    it('cell', inject(function(cellSelection) {

      // when
      click('outputEntry5');

      // then
      expect(hasFocus('outputEntry5')).to.be.true;
    }));

  });


  it('should focus on <cellSelection.changed> event', inject(
    function(cellSelection, eventBus) {

      // when
      eventBus.fire('cellSelection.changed', {
        elementId: 'outputEntry5',
        selection: {
          selected: true,
          focussed: true
        }
      });

      // then
      expect(hasFocus('outputEntry5')).to.be.true;
    }
  ));


  it('should focus on <selection.changed> event', inject(
    function(cellSelection, selection, elementRegistry) {

      // given
      const cell = elementRegistry.get('outputEntry5');

      // when
      selection.select(cell);

      // then
      expect(hasFocus('outputEntry5')).to.be.true;
    }
  ));


  describe('#getCellSelection', function() {

    it('should return current selection', inject(function(cellSelection) {

      // assume
      expect(cellSelection.getCellSelection()).not.to.exist;

      // given
      click('outputEntry5');

      // then
      expect(cellSelection.getCellSelection()).to.eql('outputEntry5');
    }));

  });


  describe('#selectCell', function() {

    describe('should select', function() {

      function verifySelect({
        currentSelection,
        direction,
        expectedSelection
      }) {

        return inject(function(cellSelection) {

          // given
          click(currentSelection);

          // when
          const changed = cellSelection.selectCell(direction);

          // then
          expect(hasFocus(expectedSelection)).to.be.true;

          expect(changed).to.be.true;
        });
      }


      it('above', verifySelect({
        currentSelection: 'outputEntry5',
        direction: 'above',
        expectedSelection: 'outputEntry3'
      }));


      it('below', verifySelect({
        currentSelection: 'outputEntry5',
        direction: 'below',
        expectedSelection: 'outputEntry7'
      }));


      it('left', verifySelect({
        currentSelection: 'outputEntry5',
        direction: 'left',
        expectedSelection: 'inputEntry6'
      }));


      it('right', verifySelect({
        currentSelection: 'outputEntry5',
        direction: 'right',
        expectedSelection: 'outputEntry6'
      }));

    });


    describe('should handle invalid selection attempts', function() {

      it('non-cell selection', inject(function(cellSelection) {

        // given
        click('__decisionProperties_name');

        // when
        const changed = cellSelection.selectCell('above');

        // then
        expect(hasFocus('__decisionProperties_name')).to.be.true;

        expect(changed).to.be.false;
      }));


      it('non-cell next selection', inject(function(cellSelection) {

        // given
        click('outputEntry7');

        expect(hasFocus('outputEntry7')).to.be.true;

        // when
        const changed = cellSelection.selectCell('below');

        // then
        expect(hasFocus('outputEntry7')).to.be.true;

        expect(changed).to.be.false;
      }));

    });
  });


  describe('integration', function() {

    let container, spy;

    beforeEach(function() {
      spy = sinon.spy();
      container = TestContainer.get(this);

      container.addEventListener('click', spy);
    });

    afterEach(function() {
      container.removeEventListener('click', spy);
    });


    it('should allow click events to bubble up', function() {

      // when
      click('outputEntry5');

      // then
      expect(spy).to.have.been.calledOnce;
    });
  });
});



// helpers ///////////////////

function click(elementId) {

  getDecisionTable().invoke(function(renderer) {

    const container = renderer.getContainer();

    expect(container).to.exist;

    const el = getNodeById(elementId, container);

    expect(el).to.exist;

    triggerClick(el);
  });

}

function hasFocus(elementId) {

  return getDecisionTable().invoke(function(renderer) {
    const el = getNodeById(elementId, renderer.getContainer());

    if (!el) {
      return false;
    }

    const focusEl = getFocusableNode(el);

    return document.activeElement === focusEl;
  });

}