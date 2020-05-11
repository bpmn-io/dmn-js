import {
  bootstrapModeler,
  inject
} from 'test/helper';

import {
  query as domQuery
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import CoreModule from 'src/core';
import KeyboardModule from 'src/features/keyboard';
import ModelingModule from 'src/features/modeling';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import TablePropertiesEditorModule from 'src/features/decision-table-properties/editor';
import SelectionModule from 'table-js/lib/features/selection';

import diagramXML from './diagram.dmn';

import {
  triggerKeyEvent,
  triggerMouseEvent
} from 'dmn-js-shared/test/util/EventUtil';

describe('features/keyboard', function() {

  const keyboardTarget = document.createElement('div');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule,
      KeyboardModule,
      DecisionTableHeadModule,
      DecisionRulesEditorModule,
      TablePropertiesEditorModule,
      SelectionModule
    ],
    keyboard: {
      bindTo: keyboardTarget
    }
  }));

  describe('keyboard binding', function() {

    it('should integrate with <attach> + <detach> events', inject(
      function(keyboard, eventBus) {

        // assume
        expect(keyboard._node).to.eql(keyboardTarget);

        // when
        eventBus.fire('detach');
        expect(keyboard._node).not.to.exist;

        // but when
        eventBus.fire('attach');
        expect(keyboard._node).to.eql(keyboardTarget);
      }
    ));

  });


  describe('default listeners', function() {

    let testContainer;

    beforeEach(function() {
      testContainer = TestContainer.get(this);
    });

    beforeEach(inject(function(keyboard) {
      keyboard.bind(testContainer);
    }));

    it('should select cell below on <ENTER>', inject(function(cellSelection) {

      // given
      const gfx = getGraphics('inputEntry1', testContainer);

      triggerMouseEvent(gfx, 'click');

      // assure
      expect(cellSelection.getCellSelection()).to.equal('inputEntry1');

      // when
      triggerKeyEvent(gfx, 'keydown', {
        keyCode: 13
      });

      // then
      expect(cellSelection.getCellSelection()).to.equal('inputEntry3');
    }));


    it('should select cell above on <SHIFT+ENTER>', inject(function(cellSelection) {

      // given
      const gfx = getGraphics('inputEntry3', testContainer);

      triggerMouseEvent(gfx, 'click');

      // assure
      expect(cellSelection.getCellSelection()).to.equal('inputEntry3');

      // when
      triggerKeyEvent(gfx, 'keydown', {
        keyCode: 13,
        shiftKey: true
      });

      // then
      expect(cellSelection.getCellSelection()).to.equal('inputEntry1');
    }));


    it('should create new rule on bottom rule <ENTER>', inject(
      function(cellSelection, sheet) {

        // given
        const gfx = getGraphics('inputEntry7', testContainer);
        const root = sheet.getRoot();
        const rowCount = getRowCount(root);

        triggerMouseEvent(gfx, 'click');

        // assure
        expect(cellSelection.getCellSelection()).to.equal('inputEntry7');

        // when
        triggerKeyEvent(gfx, 'keydown', {
          keyCode: 13
        });

        // then
        expect(rowCount).to.equal(getRowCount(root) - 1);
      }
    ));


    it('should NOT create new rule on decision name <ENTER>', inject(
      function(cellSelection, sheet) {

        // given
        const gfx = getGraphics('__decisionProperties_name', testContainer);
        const root = sheet.getRoot();
        const rowCount = getRowCount(root);

        triggerMouseEvent(gfx, 'click');

        // assure
        expect(cellSelection.getCellSelection()).to.equal('__decisionProperties_name');

        // when
        triggerKeyEvent(gfx, 'keydown', {
          keyCode: 13
        });

        // then
        expect(getRowCount(root)).to.equal(rowCount);
      }
    ));

  });

});


// helpers ///////////////

function getGraphics(elementId, container) {
  return domQuery('[data-element-id="' + elementId + '"]', container);
}

function getRowCount(root) {
  return root.rows.length;
}