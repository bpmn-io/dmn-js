/**
 * A handler that implements column deletion from the root of the column.
 */
export default class RemoveColHandler {

  constructor(sheet) {
    this._sheet = sheet;
  }

  /**
   * <do>
   */
  execute(context) {
    const sheet = this._sheet;

    const {
      col
    } = context;

    const root = context.oldRoot = col.root;

    // retrieve and remember previous col position
    const oldIndex = context.oldIndex = root ? root.cols.indexOf(col) : -1;

    if (oldIndex === -1) {
      throw new Error(`col#${col.id} not in sheet`);
    }

    sheet.removeCol(col, root);

    return root;
  }

  /**
   * <undo>
   */
  revert(context) {
    const {
      col,
      oldIndex,
      oldRoot
    } = context;

    this._sheet.addCol(col, oldIndex, oldRoot);

    return oldRoot;
  }

}

RemoveColHandler.$inject = [
  'sheet'
];
