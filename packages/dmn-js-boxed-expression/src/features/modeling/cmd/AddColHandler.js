/**
 * A handler that implements column addition to the root given in the context,
 * or the primary root.
 */
export default class AddColHandler {

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
      col,
      index
    } = context;

    if (typeof index === 'undefined') {
      index = context.index = root.cols.length;
    }

    if (!col.cells.length) {
      root.rows.forEach((row, idx) => {
        const cell = elementFactory.create('cell', { row, col });

        col.cells[idx] = cell;
      });
    }

    sheet.addCol(col, index, root);

    return root;
  }

  /**
   * <undo>
   */
  revert(context) {
    const {
      col,
      newRoot
    } = context;

    this._sheet.removeCol(col, newRoot);

    return newRoot;
  }

}

AddColHandler.$inject = [
  'sheet',
  'elementFactory'
];
