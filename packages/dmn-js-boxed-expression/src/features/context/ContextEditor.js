import { Context } from './Context';

export class ContextEditor extends Context {
  static $inject = [ 'modeling', 'dmnFactory' ];

  constructor(modeling, dmnFactory) {
    super();

    this._modeling = modeling;
    this._dmnFactory = dmnFactory;
  }

  addEntry(context) {
    this._modeling.updateProperties(context, {
      contextEntry: [
        ...this.getEntries(context),
        this._createEntry()
      ]
    });
  }

  removeEntry(context, entry) {
    this._modeling.updateProperties(context, {
      contextEntry: this.getEntries(context).filter(e => e !== entry)
    });
  }

  updateKey(entry, { name, typeRef }) {
    const variable = this.getKey(entry);

    this._modeling.updateProperties(variable, {
      name,
      typeRef
    });
  }

  _createEntry() {
    return this._dmnFactory.create('dmn:ContextEntry', {
      variable: this._dmnFactory.create('dmn:InformationItem', {
        name: 'ContextEntry'
      }),
      value: this._dmnFactory.create('dmn:LiteralExpression', {
        text: ''
      })
    });
  }
}
