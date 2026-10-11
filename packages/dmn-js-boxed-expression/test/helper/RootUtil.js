/**
 * Add a table with one input, one output and rules as additional root.
 *
 * The table is not part of the DMN definitions and the command stack is
 * cleared afterwards.
 *
 * @param {Injector} injector
 * @param {Object} [options]
 * @param {number} [options.rules=2]
 *
 * @return {Root}
 */
export function addRoot(injector, { rules = 2 } = {}) {
  const commandStack = injector.get('commandStack'),
        elementFactory = injector.get('elementFactory'),
        modeling = injector.get('modeling'),
        sheet = injector.get('sheet');

  const root = elementFactory.createRoot({});

  sheet.addRoot(root);

  modeling.addCol({ type: 'dmn:InputClause' }, undefined, root);
  modeling.addCol({ type: 'dmn:OutputClause' }, undefined, root);

  for (let i = 0; i < rules; i++) {
    modeling.addRow({ type: 'dmn:DecisionRule' }, undefined, root);
  }

  commandStack.clear();

  return root;
}

/**
 * Create a row with cells for all cols of a root.
 *
 * @param {ElementFactory} elementFactory
 * @param {Root} root
 *
 * @return {Row}
 */
export function createRow(elementFactory, root) {
  const cells = root.cols.map(col => elementFactory.createCell({ col }));

  return elementFactory.createRow({ type: 'dmn:DecisionRule', cells });
}

/**
 * Create a col with cells for all rows of a root.
 *
 * @param {ElementFactory} elementFactory
 * @param {Root} root
 *
 * @return {Col}
 */
export function createCol(elementFactory, root) {
  const col = elementFactory.createCol({ type: 'dmn:InputClause' });

  col.cells.push(...root.rows.map(row => elementFactory.createCell({ row, col })));

  return col;
}
