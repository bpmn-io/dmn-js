import { bootstrapModeler, inject } from 'test/helper';

import modelingXML from './modeling.dmn';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


describe('Modeling', function() {

  const expectedCells = [
    'dmn:UnaryTests',
    'dmn:UnaryTests',
    'dmn:LiteralExpression',
    'dmn:LiteralExpression'
  ];

  beforeEach(bootstrapModeler(modelingXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  describe('add row', function() {

    it('should execute', inject(function(modeling) {

      // when
      var row = modeling.addRow({ type: 'dmn:DecisionRule' }, 2);

      // then
      expectRowWired(row, row.root, 2, expectedCells);

      expecteDefaultCellText(row);
    }));


    it('should undo', inject(function(modeling, commandStack) {

      // given
      var row = modeling.addRow({ type: 'dmn:DecisionRule' }, 2);
      var table = row.root;

      // when
      commandStack.undo();

      // then
      expectRowDetached(row, table, expectedCells);
    }));


    it('should redo', inject(function(modeling, commandStack) {

      // when
      var row = modeling.addRow({ type: 'dmn:DecisionRule' }, 2);

      var table = row.root;

      // when
      commandStack.undo();
      commandStack.redo();

      // then
      expectRowWired(row, table, 2, expectedCells);
    }));

  });


  describe('remove row', function() {

    it('should execute', inject(function(modeling, sheet) {

      // given
      var table = sheet.getRoot();
      var row = table.rows[1];

      // when
      modeling.removeRow(row);

      // then
      expectRowDetached(row, table, expectedCells);
    }));


    it('should undo', inject(function(modeling, sheet, commandStack) {

      // given
      var table = sheet.getRoot();
      var row = table.rows[1];

      modeling.removeRow(row);

      // when
      commandStack.undo();

      // then
      expectRowWired(row, table, 1, expectedCells);
    }));


    it('should redo', inject(function(modeling, sheet, commandStack) {

      // given
      var table = sheet.getRoot();
      var row = table.rows[1];

      // when
      modeling.removeRow(row);

      commandStack.undo();
      commandStack.redo();

      // then
      expectRowDetached(row, table, expectedCells);
    }));

  });


  describe('add column', function() {

    describe('dmn:OutputClause', function() {

      it('should execute', inject(function(modeling) {

        // when
        var col = modeling.addCol({ type: 'dmn:OutputClause' }, 3);
        var table = col.root;

        // then
        expectColWired(col, table, 3, 'dmn:OutputClause');

        expecteDefaultCellText(col);
      }));


      it('should undo', inject(function(modeling, commandStack) {

        // given
        var col = modeling.addCol({ type: 'dmn:OutputClause' }, 3);
        var table = col.root;

        // when
        commandStack.undo();

        // then
        expectColDetached(col, table);
      }));


      it('should undo', inject(function(modeling, commandStack) {

        // given
        var col = modeling.addCol({ type: 'dmn:OutputClause' }, 3);
        var table = col.root;

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expectColWired(col, table, 3, 'dmn:OutputClause');
      }));

    });


    describe('dmn:InputClause', function() {

      it('should execute', inject(function(modeling) {

        // when
        var col = modeling.addCol({ type: 'dmn:InputClause' }, 0);
        var table = col.root;

        // then
        expectColWired(col, table, 0, 'dmn:InputClause');
      }));


      it('should undo', inject(function(modeling, commandStack) {

        // given
        var col = modeling.addCol({ type: 'dmn:InputClause' }, 0);
        var table = col.root;

        // when
        commandStack.undo();

        // then
        expectColDetached(col, table);
      }));


      it('should redo', inject(function(modeling, commandStack) {

        // given
        var col = modeling.addCol({ type: 'dmn:InputClause' }, 0);
        var table = col.root;

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expectColWired(col, table, 0, 'dmn:InputClause');
      }));

    });

  });


  describe('remove column', function() {

    describe('dmn:OutputClause', function() {

      it('should execute', inject(function(modeling, sheet) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[3];

        // when
        modeling.removeCol(col);

        // then
        expectColDetached(col, table);
      }));


      it('should undo', inject(function(modeling, sheet, commandStack) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[3];

        // when
        modeling.removeCol(col);

        commandStack.undo();

        // then
        expectColWired(col, table, 3, 'dmn:OutputClause');
      }));


      it('should undo', inject(function(modeling, sheet, commandStack) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[3];

        // when
        modeling.removeCol(col);

        commandStack.undo();
        commandStack.redo();

        // then
        expectColDetached(col, table);
      }));

    });


    describe('dmn:InputClause', function() {

      it('should execute', inject(function(modeling, sheet) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[1];

        // when
        modeling.removeCol(col);

        // then
        expectColDetached(col, table);
      }));


      it('should undo', inject(function(modeling, sheet, commandStack) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[1];

        // when
        modeling.removeCol(col);

        commandStack.undo();

        // then
        expectColWired(col, table, 1, 'dmn:InputClause');
      }));


      it('should undo', inject(function(modeling, sheet, commandStack) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[1];

        // when
        modeling.removeCol(col);

        commandStack.undo();
        commandStack.redo();

        // then
        expectColDetached(col, table);
      }));

    });

  });


  describe('edit allowed values', function() {

    describe('dmn:OutputClause', function() {

      it('should execute', inject(function(modeling, sheet) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[2];

        // when
        modeling.editAllowedValues(col.businessObject, [ 'foo' ]);

        // then
        expect(col.businessObject.outputValues.text).to.equal('foo');
      }));


      it('should undo', inject(function(modeling, sheet, commandStack) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[2];

        // when
        modeling.editAllowedValues(col.businessObject, [ 'foo' ]);

        commandStack.undo();

        // then
        expect(col.businessObject.outputValues.text).to.equal('"ok","notok"');
      }));


      it('should undo', inject(function(modeling, sheet, commandStack) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[2];

        // when
        modeling.editAllowedValues(col.businessObject, [ 'foo' ]);

        commandStack.undo();
        commandStack.redo();

        // then
        expect(col.businessObject.outputValues.text).to.equal('foo');
      }));

    });


    describe('dmn:InputClause', function() {

      it('should execute', inject(function(modeling, sheet) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[0];

        // when
        modeling.editAllowedValues(col.businessObject, [ 'foo' ]);

        // then
        expect(col.businessObject.inputValues.text).to.equal('foo');
      }));


      it('should undo', inject(function(modeling, sheet, commandStack) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[0];

        // when
        modeling.editAllowedValues(col.businessObject, [ 'foo' ]);

        commandStack.undo();

        // then
        expect(col.businessObject.inputValues.text).to.equal('"bronze","silver","gold"');
      }));


      it('should undo', inject(function(modeling, sheet, commandStack) {

        // given
        var table = sheet.getRoot();
        var col = table.cols[0];

        // when
        modeling.editAllowedValues(col.businessObject, [ 'foo' ]);

        commandStack.undo();
        commandStack.redo();

        // then
        expect(col.businessObject.inputValues.text).to.equal('foo');
      }));

    });

  });

});



// helpers //////////////////////

function isInput(el) {
  return (
    is(el, 'dmn:UnaryTests') ||
    is(el, 'dmn:InputClause')
  );
}

function expectColWired(col, table, idx, colType) {

  var colBo = col.businessObject;
  var tableBo = table.businessObject;

  // col type check
  expect(colBo).to.exist;
  expect(is(col, colType)).to.be.true;

  // col containment
  expect(colBo.$parent).to.equal(tableBo);

  if (isInput(col)) {
    expect(tableBo.input[idx]).to.equal(colBo);
  } else {
    expect(tableBo.output[idx - tableBo.input.length]).to.equal(colBo);
  }

  // cell containment
  col.cells.forEach(function(cell, rowIdx) {
    var cellType = isInput(col) ? 'dmn:UnaryTests' : 'dmn:LiteralExpression';

    expectCellWired(cell, table.rows[rowIdx], idx, cellType);
  });
}


function expecteDefaultCellText(colOrRow) {

  colOrRow.cells.forEach(function(c) {
    expect(c.businessObject.text).to.equal('');
  });

}

function expectColDetached(col, table) {

  var colBo = col.businessObject;
  var tableBo = table.businessObject;

  // col containment
  expect(colBo.$parent).not.to.exist;

  if (isInput(col)) {
    expect(tableBo.input).not.to.include(colBo);
  } else {
    expect(tableBo.output).not.to.include(colBo);
  }

  // cell containment
  col.cells.forEach(function(cell, rowIdx) {
    expectCellDetached(cell, table.rows[rowIdx]);
  });
}


function expectCellWired(cell, row, idx, cellType) {

  var cellBo = cell.businessObject;
  var rowBo = row.businessObject;

  expect(cellBo).to.exist;
  expect(cellBo.$parent).to.equal(rowBo);

  expect(is(cell, cellType)).to.be.true;

  var collection = isInput(cell) ? 'inputEntry' : 'outputEntry',
      collectionIdx = isInput(cell) ? idx : (idx - rowBo.inputEntry.length);

  expect(rowBo[collection][collectionIdx]).to.equal(cellBo);
}


function expectCellDetached(cell, row) {

  var cellBo = cell.businessObject;
  var rowBo = row.businessObject;

  expect(cellBo.$parent).not.to.exist;

  if (isInput(cell)) {
    expect(rowBo.inputEntry).not.to.include(cellBo);
  } else {
    expect(rowBo.outputEntry).not.to.include(cellBo);
  }
}


function expectCellsWired(row, cellTypes) {

  var rowBo = row.businessObject;

  // cells are properly wired
  row.cells.forEach(function(cell, idx) {
    expectCellWired(cell, row, idx, cellTypes[idx]);
  });

  // checksum that we have right number of inputs / outputs
  expect(rowBo.inputEntry.length + rowBo.outputEntry.length).to.eql(row.cells.length);
}


function expectRowDetached(row, table, cellTypes) {

  var rowBo = row.businessObject;
  var tableBo = table.businessObject;

  expect(rowBo.$parent).not.to.exist;
  expect(tableBo.rule).to.have.length(table.rows.length);
  expect(tableBo.rule).not.to.include(rowBo);

  // and...
  expectCellsWired(row, cellTypes);
}

function expectRowWired(row, table, idx, cellTypes) {

  var rowBo = row.businessObject;
  var tableBo = table.businessObject;

  expect(rowBo).to.exist;
  expect(rowBo.$parent).to.equal(tableBo);
  expect(tableBo.rule[idx]).to.equal(rowBo);
  expect(tableBo.rule).to.have.length(table.rows.length);

  expect(is(row, 'dmn:DecisionRule')).to.be.true;

  expectCellsWired(row, cellTypes);
}