/**
 * A handler that implements row addition to the root given in the context,
 * or the primary root.
 */
export default class AddRowHandler {

  constructor(sheet, elementFactory) {
    this._sheet = sheet;
    this._elementFactory = elementFactory;
  }

  /**
   * <do>
   */
  execute(context) {
    const sheet = this._sheet,
          elementFactory = this._elementFactory;

    const root = context.newRoot = context.root || sheet.getRoot();

    let {
      row,
      index
    } = context;

    if (typeof index === 'undefined') {
      index = context.index = root.rows.length;
    }

    if (!row.cells.length) {
      root.cols.forEach((col, idx) => {
        const cell = elementFactory.create('cell', { row, col });

        row.cells[idx] = cell;
      });
    }

    sheet.addRow(row, index, root);

    return root;
  }

  /**
   * <undo>
   */
  revert(context) {
    const {
      row,
      newRoot
    } = context;

    this._sheet.removeRow(row, newRoot);

    return newRoot;
  }

}

AddRowHandler.$inject = [
  'sheet',
  'elementFactory'
];
