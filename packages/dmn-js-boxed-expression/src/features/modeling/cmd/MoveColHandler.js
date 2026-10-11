/**
 * A handler that implements column movement within the root of the column.
 */
export default class MoveColHandler {

  constructor(modeling) {
    this._modeling = modeling;
  }

  /**
   * <preexecute>
   */
  preExecute(context) {
    const {
      col
    } = context;

    // the root is gone once the col is removed
    context.root = context.root || col.root;

    this._modeling.removeCol(col);
  }

  /**
   * <postexecute>
   */
  postExecute(context) {
    const {
      col,
      index,
      root
    } = context;

    this._modeling.addCol(col, index, root);
  }

}

MoveColHandler.$inject = [ 'modeling' ];
