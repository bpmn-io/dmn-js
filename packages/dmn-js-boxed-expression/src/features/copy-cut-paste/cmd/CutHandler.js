import { Row, Col } from 'table-js/lib/model';

/**
 * A handler that implements cutting a row or col.
 * Cutting of cells doesn't make sense.
 */
export default class CutHandler {

  constructor(clipboard, modeling) {
    this._clipboard = clipboard;
    this._modeling = modeling;
  }


  /**
   * <do>
   */
  execute(context) {
    let {
      data,
      elements
    } = context;

    context.oldData = this._clipboard.get();

    // the tables of the elements, which are removed afterwards
    const roots = context.roots = unique(elements.map(element => element.root));

    this._clipboard.set(data);

    return roots;
  }

  postExecute(context) {
    let {
      elements
    } = context;

    elements.forEach(element => {
      if (element instanceof Row) {
        this._modeling.removeRow(element);
      } else if (element instanceof Col) {
        this._modeling.removeCol(element);
      }
    });
  }

  /**
   * <undo>
   */
  revert(context) {

    const {
      oldData,
      roots
    } = context;

    this._clipboard.set(oldData);

    return roots;
  }

}

CutHandler.$inject = [ 'clipboard', 'modeling' ];


// helpers //////////

function unique(array) {
  return array.filter((element, index) => element && array.indexOf(element) === index);
}