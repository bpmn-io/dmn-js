import { Component } from 'inferno';

import {
  inject
} from 'table-js/lib/components';

export default class CreateInputsCell extends Component {
  constructor(props, context) {
    super(props, context);

    inject(this);
  }

  onClick = (event) => {
    this.editorActions.trigger('addInput');
  };

  render() {
    return (
      <td
        className="input-cell create-inputs"
        onClick={ this.onClick }
        title={ this.translate('Add input') }>-</td>
    );
  }
}

CreateInputsCell.$inject = [ 'editorActions', 'translate' ];