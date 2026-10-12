/**
 * A handler that implements row deletion from the root of the row.
 */
export default class RemoveRowHandler {

  constructor(sheet) {
    this._sheet = sheet;
  }

  /**
   * <do>
   */
  execute(context) {
    const sheet = this._sheet;

    const {
      row
    } = context;

    const root = context.oldRoot = row.root;

    // retrieve and remember previous row position
    const oldIndex = context.oldIndex = root ? root.rows.indexOf(row) : -1;

    if (oldIndex === -1) {
      throw new Error(`row#${row.id} not in sheet`);
    }

    sheet.removeRow(row, root);

    return root;
  }

  /**
   * <undo>
   */
  revert(context) {
    const {
      row,
      oldIndex,
      oldRoot
    } = context;

    this._sheet.addRow(row, oldIndex, oldRoot);

    return oldRoot;
  }

}

RemoveRowHandler.$inject = [
  'sheet'
];
