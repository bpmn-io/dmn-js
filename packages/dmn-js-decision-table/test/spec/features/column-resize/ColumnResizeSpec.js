import { bootstrapModeler } from 'test/helper';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerMouseEvent } from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import AnnotationsEditorModule from 'src/features/annotations/editor';
import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';

import ModelingModule from 'src/features/modeling';
import ColumnResizeModule from 'src/features/column-resize';
import { expect } from 'chai';


describe('column resize', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      AnnotationsEditorModule,
      CoreModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule,
      ModelingModule,
      ColumnResizeModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should resize input clause', function() {

    // given
    const inputHeader = domQuery('.input-cell', testContainer);
    const resizeHandle = domQuery('.resize-column-handle', inputHeader);
    const initialWidth = widthAsNumber(getComputedStyle(inputHeader).width);

    const initialX = resizeHandle.getBoundingClientRect().left + 10;

    // when
    triggerMouseEvent(resizeHandle, 'mousedown', initialX, 0);
    triggerMouseEvent(document, 'mousemove', initialX + 50, 0);
    triggerMouseEvent(document, 'mouseup', initialX + 50, 0);

    // then
    const finalWidth = widthAsNumber(getComputedStyle(inputHeader).width);

    expect(finalWidth).to.be.eql(initialWidth + 50);
  });


  it('should NOT resize input clause below 150px', function() {

    // given
    const inputHeader = domQuery('.input-cell', testContainer);
    const resizeHandle = domQuery('.resize-column-handle', inputHeader);

    const initialX = resizeHandle.getBoundingClientRect().left + 10;

    // when
    triggerMouseEvent(resizeHandle, 'mousedown', initialX, 0);
    triggerMouseEvent(document, 'mousemove', initialX - 50, 0);
    triggerMouseEvent(document, 'mouseup', initialX - 50, 0);

    // then
    const finalWidth = widthAsNumber(getComputedStyle(inputHeader).width);

    expect(finalWidth).to.be.eql(150);
  });


  it('should resize output clause', function() {

    // given
    const outputHeader = domQuery('.output-cell', testContainer);
    const resizeHandle = domQuery('.resize-column-handle', outputHeader);
    const initialWidth = widthAsNumber(getComputedStyle(outputHeader).width);

    const initialX = resizeHandle.getBoundingClientRect().left + 10;

    // when
    triggerMouseEvent(resizeHandle, 'mousedown', initialX, 0);
    triggerMouseEvent(document, 'mousemove', initialX + 50, 0);
    triggerMouseEvent(document, 'mouseup', initialX + 50, 0);

    // then
    const finalWidth = widthAsNumber(getComputedStyle(outputHeader).width);

    expect(finalWidth).to.be.eql(initialWidth + 50);
  });


  it('should NOT resize output clause below 150px', function() {

    // given
    const outputHeader = domQuery('.output-cell', testContainer);
    const resizeHandle = domQuery('.resize-column-handle', outputHeader);

    const initialX = resizeHandle.getBoundingClientRect().left + 10;

    // when
    triggerMouseEvent(resizeHandle, 'mousedown', initialX, 0);
    triggerMouseEvent(document, 'mousemove', initialX - 50, 0);
    triggerMouseEvent(document, 'mouseup', initialX - 50, 0);

    // then
    const finalWidth = widthAsNumber(getComputedStyle(outputHeader).width);

    expect(finalWidth).to.be.eql(150);
  });


  it('should resize annotation', function() {

    // given
    const annotationHeader = domQuery('.annotation', testContainer);
    const resizeHandle = domQuery('.resize-column-handle', annotationHeader);
    const initialWidth = widthAsNumber(getComputedStyle(annotationHeader).width);

    const initialX = resizeHandle.getBoundingClientRect().left + 10;

    // when
    triggerMouseEvent(resizeHandle, 'mousedown', initialX, 0);
    triggerMouseEvent(document, 'mousemove', initialX + 50, 0);
    triggerMouseEvent(document, 'mouseup', initialX + 50, 0);

    // then
    const finalWidth = widthAsNumber(getComputedStyle(annotationHeader).width);

    expect(finalWidth).to.be.eql(initialWidth + 50);
  });


  it('should NOT resize annotation below 400px', function() {

    // given
    const annotationHeader = domQuery('.annotation', testContainer);
    const resizeHandle = domQuery('.resize-column-handle', annotationHeader);

    const initialX = resizeHandle.getBoundingClientRect().left + 10;

    // when
    triggerMouseEvent(resizeHandle, 'mousedown', initialX, 0);
    triggerMouseEvent(document, 'mousemove', initialX - 50, 0);
    triggerMouseEvent(document, 'mouseup', initialX - 50, 0);

    // then
    const finalWidth = widthAsNumber(getComputedStyle(annotationHeader).width);

    expect(finalWidth).to.be.eql(400);
  });


  it('should extend hitbox for last input', function() {

    // given
    const inputResizeHandles = domQueryAll(
      '.input-cell .resize-column-handle', testContainer);

    // when
    const { width, right } = inputResizeHandles[1].style;

    // then
    expect(width).to.eql('27px');
    expect(right).to.eql('-7px');
  });


  it('should extend hitbox for last output', function() {

    // given
    const outputResizeHandles = domQueryAll(
      '.input-cell .resize-column-handle', testContainer);

    // when
    const { width, right } = outputResizeHandles[1].style;

    // then
    expect(width).to.eql('27px');
    expect(right).to.eql('-7px');
  });


  it('should NOT change hitbox for first input', function() {

    // given
    const inputResizeHandle = domQuery(
      '.input-cell .resize-column-handle', testContainer);

    // when
    const { width, right } = inputResizeHandle.style;

    // then
    expect(width).to.eql('');
    expect(right).to.eql('');
  });


  it('should NOT change hitbox for first output', function() {

    // given
    const outputResizeHandle = domQuery(
      '.output-cell .resize-column-handle', testContainer);

    // when
    const { width, right } = outputResizeHandle.style;

    // then
    expect(width).to.eql('');
    expect(right).to.eql('');
  });
});

function widthAsNumber(width) {
  return Number(width.slice(0, -2));
}