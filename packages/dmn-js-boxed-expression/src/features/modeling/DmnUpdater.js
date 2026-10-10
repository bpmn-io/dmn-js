import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


/**
 * A handler responsible for updating the underlying DMN
 * once changes on the table happen.
 */
export default class DmnUpdater extends CommandInterceptor {

  constructor(eventBus, sheet) {
    super(eventBus);

    this.executed([
      'row.add',
      'row.remove',
      'col.add',
      'col.remove'
    ], ifDmn((e) => {
      var context = e.context;

      var element = context.row || context.col;

      this.updateRoot(element, context.oldRoot);
    }));

    this.reverted([
      'row.add',
      'row.remove',
      'col.add',
      'col.remove'
    ], ifDmn((e) => {
      var context = e.context;

      var element = context.row || context.col;

      this.updateRoot(element, context.newRoot);
    }));

  }

  updateRoot(element, oldRoot) {

    var newRoot = element.root;

    var businessObject = element.businessObject;

    if (is(element, 'dmn:DecisionRule')) {

      // we're removing
      if (oldRoot) {
        let oldTable = oldRoot.businessObject;

        let oldRules = oldTable.get('rule');
        let oldIdx = oldRules.indexOf(businessObject);

        // unwire Row <-> Table
        oldRules.splice(oldIdx, 1);
        businessObject.$parent = null;
      }

      // we're adding
      if (newRoot) {
        let newTable = newRoot.businessObject;

        let newIdx = newRoot.rows.indexOf(element);

        // wire Row <-> Table
        newTable.get('rule').splice(newIdx, 0, businessObject);
        businessObject.$parent = newTable;

        element.cells.forEach((cell, idx) => {

          // wire Cell <-> Row
          this.wireCell(cell, element, idx);
        });
      }
    }


    if (is(element, 'dmn:InputClause') || is(element, 'dmn:OutputClause')) {

      let collection,
          collectionIdx;

      // we're removing
      if (oldRoot) {
        let oldTable = oldRoot.businessObject;

        let inputs = oldTable.get('input');
        let outputs = oldTable.get('output');

        if (is(element, 'dmn:InputClause')) {
          collection = inputs;
          collectionIdx = inputs.indexOf(businessObject);
        }

        if (is(element, 'dmn:OutputClause')) {
          collection = outputs;
          collectionIdx = outputs.indexOf(businessObject);
        }

        if (collectionIdx === -1) {
          throw new Error('inconsistent model: clause not in table');
        }

        // unwire Col <-> Table
        collection.splice(collectionIdx, 1);
        businessObject.$parent = null;

        element.cells.forEach((cel, rowIdx) => {

          // unwire Cell <-> Row
          this.unwireCell(cel, oldRoot.rows[rowIdx]);
        });

      }


      if (newRoot) {
        let newTable = newRoot.businessObject;

        let inputs = newTable.get('input');
        let outputs = newTable.get('output');

        let colIdx = newRoot.cols.indexOf(element);

        let collectionIdx,
            collection;

        if (is(element, 'dmn:InputClause')) {
          collection = inputs;
          collectionIdx = colIdx;
        }

        if (is(element, 'dmn:OutputClause')) {
          collection = outputs;
          collectionIdx = colIdx - inputs.length;
        }

        // wire Col <-> Table
        collection.splice(collectionIdx, 0, businessObject);
        businessObject.$parent = newTable;

        element.cells.forEach((cell, rowIdx) => {

          // wire Cell <-> Row
          this.wireCell(cell, newRoot.rows[rowIdx], colIdx);
        });

      }
    }
  }

  unwireCell(cell, oldRow) {

    var cellBo = cell.businessObject;

    let oldRowBo = oldRow.businessObject;

    let inputEntries = oldRowBo.get('inputEntry');
    let outputEntries = oldRowBo.get('outputEntry');

    let collection,
        collectionIdx;

    // remove from inputEntries
    if (is(cell, 'dmn:UnaryTests')) {
      collection = inputEntries;
    }

    // remove from outputEntries
    if (is(cell, 'dmn:LiteralExpression')) {
      collection = outputEntries;
    }

    collectionIdx = collection.indexOf(cellBo);

    if (collectionIdx === -1) {
      throw new Error('cell not in row');
    }

    // unwire Cell <-> Row relationship
    collection.splice(collectionIdx, 1);
    cellBo.$parent = null;
  }

  wireCell(cell, row, colIdx) {

    var cellBo = cell.businessObject;

    let rowBo = row.businessObject;

    let inputEntries = rowBo.get('inputEntry');
    let outputEntries = rowBo.get('outputEntry');

    let collection,
        collectionIdx;

    // ensure we handle already wired cells
    if (cellBo.$parent === rowBo) {
      return;
    }

    // add to inputEntries
    if (is(cell, 'dmn:UnaryTests')) {
      collection = inputEntries;
      collectionIdx = colIdx;
    }

    // add to outputEntries
    if (is(cell, 'dmn:LiteralExpression')) {
      collection = outputEntries;
      collectionIdx = colIdx - inputEntries.length;
    }

    // wire Cell <-> Row relationship
    collection.splice(collectionIdx, 0, cellBo);
    cellBo.$parent = rowBo;
  }

}

DmnUpdater.$inject = [
  'eventBus',
  'sheet'
];



// helpers //////////////////////

/**
 * Make sure the event listener is only called
 * if the touched element is a DMN element.
 *
 * @param  {Function} fn
 * @return {Function} guarded function
 */
function ifDmn(fn) {

  return function(event) {

    var context = event.context,
        element = context.row || context.col;

    if (is(element, 'dmn:DMNElement')) {
      fn(event);
    }
  };
}