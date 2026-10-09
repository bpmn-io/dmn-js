import { Component } from 'inferno';

import { is, isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';


export default class TypeRefCellContextMenu extends Component {

  constructor(props, context) {
    super(props);

    this._translate = context.injector.get('translate');
    this._modeling = context.injector.get('modeling');
    this._dataTypes = context.injector.get('dataTypes');
  }

  onTypeChange = (value) => {
    const element = this.getElement();

    const actualElement = is(element, 'dmn:LiteralExpression')
      ? element.$parent
      : element;

    let newProperties;

    if (isInput(actualElement)) {
      newProperties = {
        inputExpression: {
          typeRef: value
        }
      };
    } else if (isOutput(actualElement)) {
      newProperties = {
        typeRef: value
      };
    }

    this._modeling.updateProperties(actualElement, newProperties);
  };

  getElement() {
    return this.props.context.input || this.props.context.output;
  }

  render() {
    const element = this.getElement();

    const typeRef = (
      is(element, 'dmn:InputClause') ?
        element.inputExpression :
        element
    ).typeRef;

    const typeRefOptions = this._dataTypes.getAll().map(t => {
      return {
        label: this._translate(t),
        value: t
      };
    });

    const label = this._translate('Type');

    return (
      <div className="type-ref-edit context-menu-container">
        <div className="dms-form-control">
          <label className="dms-label">
            { label }:
          </label>

          <InputSelect
            className="type-ref-edit-select"
            label={ label }
            onChange={ this.onTypeChange }
            options={ typeRefOptions }
            value={ typeRef } />
        </div>
      </div>
    );
  }
}