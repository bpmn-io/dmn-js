import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerInputEvent,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import InputExpressionModule from 'lib/features/input-expression';
import ModelingModule from 'lib/features/modeling';


describe('input expression', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      InputExpressionModule,
      ModelingModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);

    const cellEl = domQuery('.input-expression', testContainer);

    // open input editor
    triggerClick(cellEl);
  });


  it('should edit input expression text', inject(function(elementRegistry) {

    // given
    const inputBo = elementRegistry.get('input1').businessObject;

    const inputEl = getControl('.ref-text', testContainer);

    inputEl.focus();

    // when
    triggerInputEvent(inputEl, 'foo');

    // then
    expect(inputBo.inputExpression.text).to.equal('foo');
  }));


  describe('should transform to script', function() {

    it('via input', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.ref-text', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo<br>bar<br>');

      // then
      expect(inputBo.inputExpression.text).to.equal('foo\nbar');
      expect(inputBo.inputExpression.expressionLanguage).to.equal('FEEL');
    }));


    it('via link', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const makeScriptEl = getControl('.ref-make-script', testContainer);

      // when
      triggerClick(makeScriptEl);

      // then
      expect(inputBo.inputExpression.expressionLanguage).to.equal('FEEL');
    }));

  });


  describe('should transform back to expression', function() {

    it('via input', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.ref-text', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo<br>bar<br>');
      triggerInputEvent(inputEl, 'foo');

      // then
      expect(inputBo.inputExpression.text).to.equal('foo');
      expect(inputBo.inputExpression.expressionLanguage).not.to.exist;
    }));

  });


  describe('should edit input variable', function() {

    it('set', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.ref-input-variable', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo bar');

      // then
      expect(inputBo.get('camunda:inputVariable')).to.equal('foo bar');
    }));


    it('unset', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.ref-input-variable', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo bar');
      triggerInputEvent(inputEl, '');

      // then
      expect(inputBo.get('camunda:inputVariable')).not.to.exist;
    }));

  });

});


function getControl(selector, parent) {
  return domQuery('.ref-input-expression-editor ' + selector, parent);
}