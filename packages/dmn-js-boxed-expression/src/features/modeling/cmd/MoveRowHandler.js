/**
 * A handler that implements row movement within the root of the row.
 */
export default class MoveRowHandler {

  constructor(modeling) {
    this._modeling = modeling;
  }

  /**
   * <preexecute>
   */
  preExecute(context) {
    const {
      row
    } = context;

    // the root is gone once the row is removed
    context.root = context.root || row.root;

    this._modeling.removeRow(row);
  }

  /**
   * <postexecute>
   */
  postExecute(context) {
    const {
      row,
      index,
      root
    } = context;

    this._modeling.addRow(row, index, root);
  }

}

MoveRowHandler.$inject = [ 'modeling' ];
