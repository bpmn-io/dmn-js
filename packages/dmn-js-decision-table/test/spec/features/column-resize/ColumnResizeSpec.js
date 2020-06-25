import { bootstrapModeler } from 'test/helper';

import {
  query as domQuery
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerMouseEvent } from 'dmn-js-shared/test/util/EventUtil';

import simpleXML from '../../simple.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';

import ModelingModule from 'src/features/modeling';
import ColumnResizeModule from 'src/features/column-resize';
import { expect } from 'chai';


describe('column resize', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
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
});

function widthAsNumber(width) {
  return Number(width.slice(0, -2));
}