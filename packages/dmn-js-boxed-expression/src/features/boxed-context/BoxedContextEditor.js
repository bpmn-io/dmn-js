import { BoxedContext } from './BoxedContext';

export class BoxedContextEditor extends BoxedContext {
  static $inject = [ 'modeling', 'dmnFactory' ];

  constructor(modeling, dmnFactory) {
    super();

    this._modeling = modeling;
    this._dmnFactory = dmnFactory;
  }

  addEntry(boxedContext) {
    const newEntry = this._dmnFactory.create('dmn:ContextEntry', {
      variable: this._dmnFactory.create('dmn:InformationItem', {
        name: 'ContextEntry'
      }),
      value: this._dmnFactory.create('dmn:LiteralExpression', {
        text: ''
      })
    });

    this._modeling.updateProperties(boxedContext, {
      contextEntry: [
        ...this.getEntries(boxedContext),
        newEntry
      ]
    });
  }

  setEntryName(entry, name) {
    this._modeling.updateProperties(entry.variable, { name });
  }
}
