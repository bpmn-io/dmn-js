import { bootstrapModeler, inject } from 'test/helper';

import {
  setRange
} from 'selection-ranges';

import TestContainer from 'mocha-test-container-support';

import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import {
  query as domQuery
} from 'min-dom';

import diagramXML from './diagram.dmn';

import CoreModule from 'lib/core';
import KeyboardModule from 'lib/features/keyboard';
import ModelingModule from 'lib/features/modeling';
import DecisionRulesModule from 'lib/features/decision-rules';
import DecisionRulesEditorModule from 'lib/features/decision-rules/editor';
import SelectionModule from 'table-js/lib/features/selection';


describe('features/keyboard', function() {

  const keyboardTarget = document.createElement('div');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule,
      KeyboardModule,
      DecisionRulesModule,
      DecisionRulesEditorModule,
      SelectionModule
    ],
    keyboard: {
      bindTo: keyboardTarget
    }
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


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

    it('copy - row', inject(function(clipboard, selection) {

      // given
      selection.select('inputEntry1');

      // when
      triggerEvent(keyboardTarget, 'keydown', {
        keyCode: 67,
        ctrlKey: true
      });

      // then
      expect(clipboard.isEmpty()).to.be.false;
    }));


    it('copy - col', inject(function(clipboard, selection) {

      // given
      selection.select('inputEntry1');

      // when
      triggerEvent(keyboardTarget, 'keydown', {
        keyCode: 67,
        ctrlKey: true,
        shiftKey: true
      });

      // then
      expect(clipboard.isEmpty()).to.be.false;
    }));


    it('should not copy if range', inject(function(clipboard, selection) {

      // given
      selection.select('inputEntry1');

      const selectedCell =
        domQuery('[data-element-id="inputEntry1"]', testContainer);

      const editor = queryEditor('', selectedCell);

      setRange(editor, {
        start: 0,
        end: 1
      });

      // when
      triggerEvent(keyboardTarget, 'keydown', {
        keyCode: 67,
        ctrlKey: true,
        shiftKey: true
      });

      // then
      expect(clipboard.isEmpty()).to.be.true;
    }));


    it('cut - row', inject(function(clipboard, selection) {

      // given
      selection.select('inputEntry1');

      // when
      triggerEvent(keyboardTarget, 'keydown', {
        keyCode: 88,
        ctrlKey: true
      });

      // then
      expect(clipboard.isEmpty()).to.be.false;
    }));


    it('cut - col', inject(function(clipboard, selection) {

      // given
      selection.select('inputEntry1');

      // when
      triggerEvent(keyboardTarget, 'keydown', {
        keyCode: 88,
        ctrlKey: true,
        shiftKey: true
      });

      // then
      expect(clipboard.isEmpty()).to.be.false;
    }));


    it('should not cut if range', inject(function(clipboard, selection) {

      // given
      selection.select('inputEntry1');

      const selectedCell =
        domQuery('[data-element-id="inputEntry1"]', testContainer);

      const editor = queryEditor('', selectedCell);

      setRange(editor, {
        start: 0,
        end: 1
      });

      // when
      triggerEvent(keyboardTarget, 'keydown', {
        keyCode: 88,
        ctrlKey: true,
        shiftKey: true
      });

      // then
      expect(clipboard.isEmpty()).to.be.true;
    }));


    describe('paste', function() {

      let root,
          rule2,
          rule3,
          rule4,
          input2,
          input3,
          output1,
          output2,
          output3;

      beforeEach(inject(function(elementRegistry, sheet) {
        root = sheet.getRoot();

        rule2 = elementRegistry.get('rule2');
        rule3 = elementRegistry.get('rule3');
        rule4 = elementRegistry.get('rule4');
        input2 = elementRegistry.get('input2');
        input3 = elementRegistry.get('input3');
        output1 = elementRegistry.get('output1');
        output2 = elementRegistry.get('output2');
        output3 = elementRegistry.get('output3');
      }));


      it('paste - row', inject(function(elementRegistry, selection) {

        // given
        selection.select('inputEntry1');

        triggerEvent(keyboardTarget, 'keydown', {
          keyCode: 88,
          ctrlKey: true
        });

        selection.select('inputEntry7');

        // when
        triggerEvent(keyboardTarget, 'keydown', {
          keyCode: 86,
          ctrlKey: true
        });

        // then
        const newRule1 = elementRegistry.get('rule1');

        expectOrder(root.rows, [
          rule2,
          rule3,
          rule4,
          newRule1
        ]);
      }));


      it('paste - col', inject(function(elementRegistry, selection) {

        // given
        selection.select('inputEntry1');

        triggerEvent(keyboardTarget, 'keydown', {
          keyCode: 88,
          ctrlKey: true,
          shiftKey: true
        });

        selection.select('inputEntry2');

        // when
        triggerEvent(keyboardTarget, 'keydown', {
          keyCode: 86,
          ctrlKey: true,
          shiftKey: true
        });

        // then
        const newInput1 = elementRegistry.get('input1');

        expectOrder(root.cols, [
          input2,
          newInput1,
          input3,
          output1,
          output2,
          output3
        ]);
      }));


      it('should not paste if range', inject(
        function(clipboard, elementRegistry, selection) {

          // given
          selection.select('inputEntry1');

          triggerEvent(keyboardTarget, 'keydown', {
            keyCode: 88,
            ctrlKey: true
          });

          selection.select('inputEntry7');

          const selectedCell =
            domQuery('[data-element-id="inputEntry7"]', testContainer);

          const editor = queryEditor('', selectedCell);

          setRange(editor, {
            start: 0,
            end: 1
          });

          // when
          triggerEvent(keyboardTarget, 'keydown', {
            keyCode: 86,
            ctrlKey: true
          });

          // then
          expect(clipboard.isEmpty()).to.be.false;

          expect(elementRegistry.get('rule1')).to.not.exist;
        }
      ));

    });

  });

});

// helpers //////////

/**
 * Triggers a DOM event with optional data.
 */
function triggerEvent(element, type, data = {}) {
  const event = document.createEvent('Event');

  event.initEvent(type, true, true);

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      event[key] = data[key];
    }
  }

  element.dispatchEvent(event);

  return event;
}

function expectOrder(actual, expected) {
  expected.forEach((e, index) => {
    expect(e).to.equal(actual[index]);
  });
}