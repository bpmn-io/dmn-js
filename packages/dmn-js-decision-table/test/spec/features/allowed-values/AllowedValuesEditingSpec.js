import {
  bootstrapModeler,
  inject
} from 'test/helper';

import {
  triggerChangeEvent,
  triggerInputEvent,
  triggerKeyEvent,
  triggerMouseEvent,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import { classes as domClasses, query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import inputOutputValuesXML from './AllowedValues.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';

import AllowedValuesEditingModule
  from 'lib/features/allowed-values';

import TypeRefEditingModule from 'lib/features/type-ref';
import ModelingModule from 'lib/features/modeling';


describe('decision-table-head/allowed-values', function() {

  beforeEach(bootstrapModeler(inputOutputValuesXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      AllowedValuesEditingModule,
      TypeRefEditingModule,
      ModelingModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('input values', function() {

    let allowedValuesEdit;

    beforeEach(function() {
      const cell = domQuery('.input-cell.type-ref', testContainer);

      triggerClick(cell);

      allowedValuesEdit = domQuery('.allowed-values-edit', testContainer);
    });


    it('should render input values', function() {

      // then
      expectValuesRendered(allowedValuesEdit, [
        '"bronze"',
        '"silver"',
        '"gold"'
      ]);
    });


    it('should add value', inject(function(elementRegistry) {

      // when
      const input = domQuery('.dms-input', allowedValuesEdit);

      input.focus();

      triggerInputEvent(input, '"foo"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expectValuesRendered(allowedValuesEdit, [
        '"bronze"',
        '"silver"',
        '"gold"',
        '"foo"'
      ]);

      expect(
        elementRegistry.get('input1').businessObject.inputValues.text
      ).to.equal(
        '"bronze","silver","gold","foo"'
      );
    }));


    it('should add multiple values', inject(function(elementRegistry) {

      // when
      const input = domQuery('.dms-input', allowedValuesEdit);

      input.focus();

      triggerInputEvent(input, '"foo", "bar"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expectValuesRendered(allowedValuesEdit, [
        '"bronze"',
        '"silver"',
        '"gold"',
        '"foo"',
        '"bar"'
      ]);

      expect(
        elementRegistry.get('input1').businessObject.inputValues.text
      ).to.equal(
        '"bronze","silver","gold","foo","bar"'
      );
    }));


    it('should remove value', inject(function(elementRegistry) {

      // when
      const value = domQuery('.remove', allowedValuesEdit);

      triggerMouseEvent(value, 'mouseup');

      // then
      expectValuesRendered(allowedValuesEdit, [
        '"silver"',
        '"gold"'
      ]);

      expect(elementRegistry.get('input1').businessObject.inputValues.text)
        .to.equal('"silver","gold"');
    }));


    it('should show placeholder when empty values', function() {

      // when
      let remove = domQuery('.remove', allowedValuesEdit);

      triggerMouseEvent(remove, 'mouseup');

      remove = domQuery('.remove', allowedValuesEdit);

      triggerMouseEvent(remove, 'mouseup');

      remove = domQuery('.remove', allowedValuesEdit);

      triggerMouseEvent(remove, 'mouseup');

      // then
      expect(domQuery('.placeholder', allowedValuesEdit)).to.exist;
    });


    it('should NOT show placeholder when no values', function() {

      // given
      const button = domQuery('.del-values', allowedValuesEdit);

      // when
      triggerMouseEvent(button, 'mouseup');

      // then
      expect(domQuery('.placeholder', allowedValuesEdit)).to.not.exist;
    });


    it('should validate value', inject(function(elementRegistry) {

      // when
      const input = domQuery('.dms-input', allowedValuesEdit);

      input.focus();

      triggerInputEvent(input, '"foo');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expect(domClasses(input).has('invalid')).to.be.true;

      expectValuesRendered(allowedValuesEdit, [
        '"bronze"',
        '"silver"',
        '"gold"'
      ]);

      expect(elementRegistry.get('input1').businessObject.inputValues.text)
        .to.equal('"bronze","silver","gold"');
    }));


    it('should delete allowed values when type is changed to anything but string',
      inject(function(elementRegistry) {

        // given
        const select = domQuery('.type-ref-edit-select', testContainer);

        // when
        triggerChangeEvent(select, 'boolean');

        // then
        expect(elementRegistry.get('input1').businessObject.inputValues).not.to.exist;
      }));


    it('should delete allowed values',
      inject(function(elementRegistry) {

        // given
        const button = domQuery('.del-values', allowedValuesEdit);

        // when
        triggerMouseEvent(button, 'mouseup');

        // then
        expect(elementRegistry.get('input1').businessObject.inputValues).not.to.exist;
      }));

  });


  describe('output values', function() {

    let allowedValuesEdit;

    beforeEach(function() {
      const cell = domQuery('.output-cell.type-ref', testContainer);

      triggerClick(cell);

      allowedValuesEdit = domQuery('.allowed-values-edit', testContainer);
    });


    it('should render output values', function() {

      // then
      expectValuesRendered(allowedValuesEdit, [
        '"ok"',
        '"notok"'
      ]);
    });


    it('should add value', inject(function(elementRegistry) {

      // when
      const input = domQuery('.dms-input', allowedValuesEdit);

      input.focus();

      triggerInputEvent(input, '"foo"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expectValuesRendered(allowedValuesEdit, [
        '"ok"',
        '"notok"',
        '"foo"'
      ]);

      expect(elementRegistry.get('output1').businessObject.outputValues.text)
        .to.equal('"ok","notok","foo"');
    }));


    it('should add multiple values', inject(function(elementRegistry) {

      // when
      const input = domQuery('.dms-input', allowedValuesEdit);

      input.focus();

      triggerInputEvent(input, '"foo", "bar"');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expectValuesRendered(allowedValuesEdit, [
        '"ok"',
        '"notok"',
        '"foo"',
        '"bar"'
      ]);

      expect(elementRegistry.get('output1').businessObject.outputValues.text)
        .to.equal('"ok","notok","foo","bar"');
    }));


    it('should remove value', inject(function(elementRegistry) {

      // when
      const value = domQuery('.remove', allowedValuesEdit);

      triggerMouseEvent(value, 'mouseup');

      // then
      expectValuesRendered(allowedValuesEdit, [
        '"notok"'
      ]);

      expect(elementRegistry.get('output1').businessObject.outputValues.text)
        .to.equal('"notok"');
    }));


    it('should show placeholder when empty values', function() {

      // when
      let remove = domQuery('.remove', allowedValuesEdit);

      triggerMouseEvent(remove, 'mouseup');

      remove = domQuery('.remove', allowedValuesEdit);

      triggerMouseEvent(remove, 'mouseup');

      // then
      expect(domQuery('.placeholder', allowedValuesEdit)).to.exist;
    });


    it('should NOT show placeholder when no values', function() {

      // given
      const button = domQuery('.del-values', allowedValuesEdit);

      // when
      triggerMouseEvent(button, 'mouseup');

      // then
      expect(domQuery('.placeholder', allowedValuesEdit)).to.not.exist;
    });


    it('should validate value', inject(function(elementRegistry) {

      // when
      const input = domQuery('.dms-input', allowedValuesEdit);

      input.focus();

      triggerInputEvent(input, '"foo');

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expect(domClasses(input).has('invalid')).to.be.true;

      expectValuesRendered(allowedValuesEdit, [
        '"ok"',
        '"notok"'
      ]);

      expect(elementRegistry.get('output1').businessObject.outputValues.text)
        .to.equal('"ok","notok"');
    }));


    it('should delete allowed values when type is changed to anything but string',
      inject(function(elementRegistry) {

        // given
        const select = domQuery('.type-ref-edit-select', testContainer);

        // when
        triggerChangeEvent(select, 'boolean');

        // then
        expect(elementRegistry.get('output1').businessObject.outputValues).not.to.exist;
      }));


    it('should delete allowed values',
      inject(function(elementRegistry) {

        // given
        const button = domQuery('.del-values', allowedValuesEdit);

        // when
        triggerMouseEvent(button, 'mouseup');

        // then
        expect(elementRegistry.get('output1').businessObject.outputValues).not.to.exist;
      }));

  });

});


// helpers //////////////////////

function expectValuesRendered(element, expected) {
  const values = arrayFromNodeList(domQuery.all('.item', element));

  values.forEach((value, index) => {
    expect(value.textContent.replace(/^\s?/, '')).to.equal(expected[index]);
  });
}

function arrayFromNodeList(nodeList) {
  return [].slice.call(nodeList);
}