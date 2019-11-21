// eslint-disable-next-line
import Inferno from 'inferno';

/* global sinon */

import { bootstrapModeler, inject } from 'test/helper';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from './drag-and-drop.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';
import ModelingModule from 'src/features/modeling';
import DecisionRulesModule from 'src/features/decision-rules';
import DragAndDropModule from 'src/features/drag-and-drop';
import DecisionRuleIndicesModule from 'src/features/decision-rule-indices';


describe('drag and drop', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule,
      ModelingModule,
      DecisionRulesModule,
      DragAndDropModule,
      DecisionRuleIndicesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('rules', function() {

    let rule1, rule2, rule3, rule4;

    beforeEach(inject(function(elementRegistry) {
      rule1 = elementRegistry.get('rule1');
      rule2 = elementRegistry.get('rule2');
      rule3 = elementRegistry.get('rule3');
      rule4 = elementRegistry.get('rule4');
    }));

    function expectRows(expectedRows) {
      const _expectRows = inject(function(sheet) {
        const { rows } = sheet.getRoot();

        rows.forEach((row, index) => {
          expect(row).to.equal(expectedRows[index]);
        });
      });

      _expectRows();
    }


    it('should insert rule above', inject(function() {

      // when
      dragAndDropRow('rule1', 'rule4', 'top', testContainer);

      // then
      expectRows([
        rule2,
        rule3,
        rule1,
        rule4
      ]);
    }));


    it('should insert rule below', inject(function() {

      // when
      dragAndDropRow('rule1', 'rule4', 'bottom', testContainer);

      // then
      expectRows([
        rule2,
        rule3,
        rule4,
        rule1
      ]);
    }));


    it('should NOT move row if target is row', inject(function(modeling) {

      // given
      const spy = sinon.spy(modeling, 'moveRow');

      dragAndDropRow('rule1', 'rule2', 'top', testContainer);

      // then
      expect(spy).to.not.have.been.called;

      expectRows([
        rule1,
        rule2,
        rule3,
        rule4
      ]);
    }));


    it('should cancel', inject(function() {

      // given
      const dragHandle = getRowDragHandle('rule1', testContainer);

      const cell = getRowCells('rule2', testContainer)[0];

      const cellBounds = cell.getBoundingClientRect();

      const dataTransfer = getDataTransferMock();

      triggerEvent(dragHandle, 'dragstart', {
        dataTransfer
      });

      triggerEvent(cell, 'dragover', {
        dataTransfer,
        clientX: cellBounds.left,
        clientY: cellBounds.top
      });

      // when
      triggerEvent(document, 'dragend');

      // then
      expect(domQuery('.dragover', testContainer)).to.not.exist;
      expect(domQuery('.dragged', testContainer)).to.not.exist;
      expect(domQuery('.dragger', testContainer)).to.not.exist;
    }));

  });


  describe('inputs/outputs', function() {

    let input1, input2, input3, output1, output2, output3;

    beforeEach(inject(function(elementRegistry) {
      input1 = elementRegistry.get('input1');
      input2 = elementRegistry.get('input2');
      input3 = elementRegistry.get('input3');
      output1 = elementRegistry.get('output1');
      output2 = elementRegistry.get('output2');
      output3 = elementRegistry.get('output3');
    }));

    function expectCols(expectedCols) {
      const _expectCols = inject(function(sheet) {
        const { cols } = sheet.getRoot();

        cols.forEach((col, index) => {
          expect(col).to.equal(expectedCols[index]);
        });
      });

      _expectCols();
    }


    describe('input', function() {

      it('should insert input left', inject(function() {

        // when
        dragAndDropCol('input3', 'input1', 'left', testContainer);

        // then
        expectCols([
          input3,
          input1,
          input2,
          output1,
          output2,
          output3
        ]);
      }));


      it('should insert input right', inject(function() {

        // when
        dragAndDropCol('input3', 'input1', 'right', testContainer);

        // then
        expectCols([
          input1,
          input3,
          input2,
          output1,
          output2,
          output3
        ]);
      }));


      it('should NOT move col if target is col', inject(function(modeling) {

        // given
        const spy = sinon.spy(modeling, 'moveCol');

        dragAndDropCol('input3', 'input2', 'right', testContainer);

        // then
        expect(spy).to.not.have.been.called;

        expectCols([
          input1,
          input2,
          input3,
          output1,
          output2,
          output3
        ]);
      }));

    });


    describe('output', function() {

      it('should insert output left', inject(function() {

        // when
        dragAndDropCol('output3', 'output1', 'left', testContainer);

        // then
        expectCols([
          input1,
          input2,
          input3,
          output3,
          output1,
          output2
        ]);
      }));


      it('should insert output right', inject(function() {

        // when
        dragAndDropCol('output3', 'output1', 'right', testContainer);

        // then
        expectCols([
          input1,
          input2,
          input3,
          output1,
          output3,
          output2
        ]);
      }));


      it('should NOT move col if target is col', inject(function(modeling) {

        // given
        const spy = sinon.spy(modeling, 'moveCol');

        dragAndDropCol('output3', 'output2', 'right', testContainer);

        // then
        expect(spy).to.not.have.been.called;

        expectCols([
          input1,
          input2,
          input3,
          output1,
          output2,
          output3
        ]);
      }));

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
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      event[key] = data[key];
    }
  }

  element.dispatchEvent(event);

  return event;
}

/**
 * Returns a mocked DataTransfer object.
 */
function getDataTransferMock() {
  return {
    setDragImage: () => {}
  };
}

function getRowDragHandle(id, testContainer) {
  return domQuery(`[data-row-id="${id}"] .dmn-icon-drag`, testContainer);
}

function getColDragHandle(id, testContainer) {
  return domQuery(`[data-col-id="${id}"] .dmn-icon-drag`, testContainer);
}

function getRowCells(id, testContainer) {
  return domQueryAll(`[data-row-id="${id}"]`, testContainer);
}

function getColCells(id, testContainer) {
  return domQueryAll(`[data-col-id="${id}"]`, testContainer);
}

function dragAndDropRow(draggedRowId, targetRowId, position, testContainer) {
  const dragHandle = getRowDragHandle(draggedRowId, testContainer);

  const cell = getRowCells(targetRowId, testContainer)[0];

  const cellBounds = cell.getBoundingClientRect();

  const dataTransfer = getDataTransferMock();

  // when
  triggerEvent(dragHandle, 'dragstart', {
    dataTransfer
  });

  const isBottom = position === 'bottom';

  const clientX = cellBounds.left,
        clientY = cellBounds.top + (isBottom ? cellBounds.height : 0);

  triggerEvent(cell, 'dragover', {
    dataTransfer,
    clientX,
    clientY
  });

  triggerEvent(cell, 'drop', {
    dataTransfer,
    clientX,
    clientY
  });
}


function dragAndDropCol(draggedCol, targetColId, position, testContainer) {
  const dragHandle = getColDragHandle(draggedCol, testContainer);

  const cell = getColCells(targetColId, testContainer)[0];

  const cellBounds = cell.getBoundingClientRect();

  const dataTransfer = getDataTransferMock();

  // when
  triggerEvent(dragHandle, 'dragstart', {
    dataTransfer
  });

  const isRight = position === 'right';

  const clientX = cellBounds.left + (isRight ? cellBounds.width : 0),
        clientY = cellBounds.top;

  triggerEvent(cell, 'dragover', {
    dataTransfer,
    clientX,
    clientY
  });

  triggerEvent(cell, 'drop', {
    dataTransfer,
    clientX,
    clientY
  });
}