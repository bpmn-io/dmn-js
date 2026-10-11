import BaseSheet from 'table-js/lib/core/Sheet';

/**
 * A sheet that holds more than one table.
 *
 * The first table, set via `setRoot`, is the primary root which `getRoot`
 * returns. Further tables are added via `addRoot`. Rows and columns can be
 * added to and removed from any root, the root defaults to the one the
 * element belongs to, and finally to the primary root.
 */
export default class Sheet extends BaseSheet {

  constructor(elementRegistry, eventBus) {
    super(elementRegistry, eventBus);

    this._roots = [];

    eventBus.on('table.clear', () => {
      this._roots = [];
    });
  }

  /**
   * Add an additional root, next to the primary root.
   *
   * @param {Root} root
   */
  addRoot(root) {
    this._roots.push(root);

    this._eventBus.fire('sheet.rootAdded', { root });
  }

  /**
   * Remove a root, including its elements.
   *
   * @param {Root} root
   */
  removeRoot(root) {
    const index = this._roots.indexOf(root);

    if (root !== this._root && index === -1) {
      return;
    }

    root.rows.forEach(row => {
      row.cells.forEach(cell => this._elementRegistry.remove(cell));

      this._elementRegistry.remove(row);
    });

    root.cols.forEach(col => this._elementRegistry.remove(col));

    if (root === this._root) {

      // the next root becomes the primary root
      const [ next, ...others ] = this._roots;

      this._roots = others;

      this.setRoot(next || null);
    } else {
      this._roots.splice(index, 1);
    }

    this._eventBus.fire('sheet.rootRemoved', { root });
  }

  /**
   * Return all roots, the primary root first.
   *
   * @return {Root[]}
   */
  getRoots() {
    return this._root ? [ this._root, ...this._roots ] : [ ...this._roots ];
  }

  /**
   * Return the root a root, row, col or cell belongs to.
   *
   * @param {Root|Row|Col|Cell} element
   *
   * @return {Root|undefined}
   */
  getRootOf(element) {
    if (!element) {
      return;
    }

    if (this.getRoots().includes(element)) {
      return element;
    }

    return element.root ||
      (element.row && element.row.root) ||
      (element.col && element.col.root);
  }

  /**
   * Add row to a root.
   *
   * @param {Object} row - Row.
   * @param {number} [index]
   * @param {Root} [root] - Defaults to the primary root.
   */
  addRow(row, index, root = this.getRoot()) {
    if (root.cols.length != row.cells.length) {
      throw new Error('number of cells is not equal to number of cols');
    }

    if (typeof index === 'undefined') {
      index = root.rows.length;
    }

    addAtIndex(index, root.rows, row);
    row.root = root;

    this._elementRegistry.add(row);

    row.cells.forEach((cell, idx) => {
      this._elementRegistry.add(cell);

      cell.row = row;
      cell.col = root.cols[idx];

      addAtIndex(index, root.cols[idx].cells, cell);
    });

    this._eventBus.fire('row.add', { row, root });

    return row;
  }

  /**
   * Remove row from its root.
   *
   * @param {Object|string} row - Row or row ID.
   * @param {Root} [root] - Defaults to the root of the row, then the primary root.
   */
  removeRow(row, root) {
    if (typeof row === 'string') {
      row = this._elementRegistry.get(row);
    }

    if (!row) {
      return;
    }

    root = root || row.root || this.getRoot();

    const index = root.rows.indexOf(row);

    if (index === -1) {
      return;
    }

    removeAtIndex(index, root.rows);
    row.root = undefined;

    this._elementRegistry.remove(row);

    row.cells.forEach((cell, idx) => {
      this._elementRegistry.remove(cell);

      cell.col = undefined;

      removeAtIndex(index, root.cols[idx].cells);
    });

    this._eventBus.fire('row.remove', { row, root });
  }

  /**
   * Add col to a root.
   *
   * @param {Object} col
   * @param {number} [index]
   * @param {Root} [root] - Defaults to the primary root.
   */
  addCol(col, index, root = this.getRoot()) {
    this._elementRegistry.add(col);

    if (root.rows.length != col.cells.length) {
      throw new Error('number of cells is not equal to number of rows');
    }

    if (typeof index === 'undefined') {
      index = root.cols.length;
    }

    addAtIndex(index, root.cols, col);
    col.root = root;

    col.cells.forEach((cell, idx) => {
      this._elementRegistry.add(cell);

      cell.col = col;
      cell.row = root.rows[idx];

      addAtIndex(index, root.rows[idx].cells, cell);
    });

    this._eventBus.fire('col.add', { col, root });

    return col;
  }

  /**
   * Remove col from its root.
   *
   * @param {Object|string} col - Col or col ID.
   * @param {Root} [root] - Defaults to the root of the col, then the primary root.
   */
  removeCol(col, root) {
    if (typeof col === 'string') {
      col = this._elementRegistry.get(col);
    }

    if (!col) {
      return;
    }

    root = root || col.root || this.getRoot();

    const index = root.cols.indexOf(col);

    if (index === -1) {
      return;
    }

    removeAtIndex(index, root.cols);
    col.root = undefined;

    this._elementRegistry.remove(col);

    col.cells.forEach((cell, idx) => {
      this._elementRegistry.remove(cell);

      cell.row = undefined;

      removeAtIndex(index, root.rows[idx].cells);
    });

    this._eventBus.fire('col.remove', { col, root });
  }

  /**
   * @param {Root} [root]
   */
  resized(root) {
    this._eventBus.fire('sheet.resized', { root });
  }

}

Sheet.$inject = [ 'elementRegistry', 'eventBus' ];


// helpers /////////////

function addAtIndex(idx, arr, el) {
  arr.splice(idx, 0, el);
}

function removeAtIndex(idx, arr) {
  arr.splice(idx, 1);
}
