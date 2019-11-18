import {
  bootstrapModeler,
  inject
} from 'test/helper';

import {
  setRange
} from 'selection-ranges';

import TestContainer from 'mocha-test-container-support';

import {
  queryEditor
} from 'dmn-js-shared/test/util/EditorUtil';

import {
  query as domQuery
} from 'min-dom';

import CoreModule from 'src/core';
import KeyboardModule from 'src/features/keyboard';
import CopyCutPasteKeyBindingsModule from 'src/features/copy-cut-paste/key-bindings';
import ModelingModule from 'src/features/modeling';
import DecisionRulesModule from 'src/features/decision-rules';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import SelectionModule from 'table-js/lib/features/selection';

import diagramXML from './copy-cut-paste-key-bindings.dmn';


describe('features/copy-cut-paste/key-bindings', function() {

  const keyboardTarget = document.createElement('div');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule,
      KeyboardModule,
      DecisionRulesModule,
      DecisionRulesEditorModule,
      CopyCutPasteKeyBindingsModule,
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


  describe('should copy', function() {

    it('row', inject(function(clipboard, selection) {

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


    it('col', inject(function(clipboard, selection) {

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


    it('ignoring range', inject(function(clipboard, selection) {

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

  });


  describe('should cut', function() {

    it('row', inject(function(clipboard, selection) {

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


    it('col', inject(function(clipboard, selection) {

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


    it('ignoring range', inject(function(clipboard, selection) {

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

  });


  describe('should paste', function() {

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


    it('row', inject(function(elementRegistry, selection) {

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


    it('col', inject(function(elementRegistry, selection) {

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


    it('ignoring range', inject(
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


// helpers //////////

/**
 * Triggers a DOM event with optional data.
 */
function triggerEvent(element, type, data = {}) {
  const event = document.createEvent('Event');

  event.initEvent(type, true, true);

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
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