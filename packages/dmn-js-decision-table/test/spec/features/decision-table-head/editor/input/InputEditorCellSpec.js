import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerInputEvent,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from './InputEditor.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';
import ModelingModule from 'src/features/modeling';
import KeyboardModule from 'src/features/keyboard';


describe('decision-table-head/editor - input', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule,
      ModelingModule,
      KeyboardModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  function openEditor(columnId) {
    const cellEl = domQuery(`[data-col-id="${columnId}"]`, testContainer);

    // open input editor
    triggerClick(cellEl);

    // return input editor
    return domQuery('.input-edit', testContainer);
  }


  it('should add input expression text', inject(function(elementRegistry) {

    // given
    const editorEl = openEditor('input2');

    const inputBo = elementRegistry.get('input2').businessObject;

    const inputEl = getControl('.ref-text', editorEl);

    // assume
    expect(inputEl.textContent).to.eql('');

    inputEl.focus();

    // when
    triggerInputEvent(inputEl, 'foo');

    // then
    expect(inputBo.inputExpression.text).to.equal('foo');
  }));


  it('should edit input expression text', inject(function(elementRegistry) {

    // given
    const editorEl = openEditor('input1');

    const inputBo = elementRegistry.get('input1').businessObject;

    const inputEl = getControl('.ref-text', editorEl);

    inputEl.focus();

    // when
    triggerInputEvent(inputEl, 'foo');

    // then
    expect(inputBo.inputExpression.text).to.equal('foo');
  }));


  describe('should transform to script', function() {

    beforeEach(function() {
      openEditor('input1');
    });


    it('via input', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.ref-text', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo<br>bar<br>');

      // then
      expect(inputBo.inputExpression.text).to.equal('foo\nbar');
      expect(inputBo.inputExpression.expressionLanguage).to.equal('juel');
    }));


    it('via link', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const makeScriptEl = getControl('.ref-make-script', testContainer);

      // when
      triggerClick(makeScriptEl);

      // then
      expect(inputBo.inputExpression.expressionLanguage).to.equal('juel');
    }));

  });


  describe('should transform back to expression', function() {

    beforeEach(function() {
      openEditor('input1');
    });


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

    beforeEach(function() {
      openEditor('input1');
    });


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


  describe('should edit input label', function() {

    beforeEach(function() {
      openEditor('input1');
    });


    it('set', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.ref-input-label', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo bar');

      // then
      expect(inputBo.get('label')).to.equal('foo bar');
    }));


    it('unset', inject(function(elementRegistry) {

      // given
      const inputBo = elementRegistry.get('input1').businessObject;

      const inputEl = getControl('.ref-input-label', testContainer);

      inputEl.focus();

      // when
      triggerInputEvent(inputEl, 'foo bar');
      triggerInputEvent(inputEl, '');

      // then
      expect(inputBo.get('label')).not.to.exist;
    }));

  });

});


function getControl(selector, parent) {
  return domQuery('.ref-input-editor ' + selector, parent);
}