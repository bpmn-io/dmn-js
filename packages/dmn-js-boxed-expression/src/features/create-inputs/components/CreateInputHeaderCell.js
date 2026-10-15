import { Component } from 'inferno';

import {
  inject
} from 'table-js/lib/components';

export default class CreateInputsHeaderCell extends Component {
  constructor(props, context) {
    super(props, context);

    inject(this);
  }

  onClick = (event) => {
    this.editorActions.trigger('addInput');
  };

  render() {
    return (
      <th
        className="input-cell create-inputs header actionable"
        onClick={ this.onClick }
        title={ this.translate('Add input') }>
        { this.translate('Input') } <button
          className="add-input dmn-icon-plus action-icon"
          title={ this.translate('Add input') }
        />
      </th>
    );
  }
}

CreateInputsHeaderCell.$inject = [ 'editorActions', 'translate' ];