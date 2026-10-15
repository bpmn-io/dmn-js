import { Row, Col } from 'table-js/lib/model';

/**
 * A handler that implements cutting a row or col.
 * Cutting of cells doesn't make sense.
 */
export default class CutHandler {

  constructor(clipboard, modeling, sheet) {
    this._clipboard = clipboard;
    this._modeling = modeling;
    this._sheet = sheet;
  }


  /**
   * <do>
   */
  execute(context) {
    let {
      data
    } = context;

    context.oldData = this._clipboard.get();

    this._clipboard.set(data);

    return this._sheet.getRoot();
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
      oldData
    } = context;

    this._clipboard.set(oldData);

    return this._sheet.getRoot();
  }

}

CutHandler.$inject = [ 'clipboard', 'modeling', 'sheet' ];