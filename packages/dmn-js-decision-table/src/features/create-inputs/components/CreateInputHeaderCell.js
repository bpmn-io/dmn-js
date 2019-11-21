import { Component } from 'inferno';

import {
  inject
} from 'table-js/lib/components';

export default class CreateInputsHeaderCell extends Component {
  constructor(props, context) {
    super(props, context);

    inject(this);

    this._translate = context.injector.get('translate');
  }

  onClick = (event) => {
    this.editorActions.trigger('addInput');
  }

  render() {
    return (
      <th
        className="input-cell create-inputs header actionable"
        onClick={ this.onClick }
        rowspan="3"
        title="Add Input">
        { this._translate('Input') || 'Input' } <span
          className="add-input dmn-icon-plus action-icon"
          title="Add Input"
        ></span>
      </th>
    );
  }
}

CreateInputsHeaderCell.$inject = [ 'editorActions' ];