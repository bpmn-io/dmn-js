import { Component } from 'inferno';

import OutputEditor from './OutputEditor';


export default class InputCellContextMenu extends Component {

  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');
    this._contextMenu = context.injector.get('contextMenu');

    this.state = {};

    const debounceInput = context.injector.get('debounceInput');

    this.persistChanges = debounceInput(this.persistChanges);
  }

  persistChanges = () => {
    const { output } = this.props.context;

    const { unsaved } = this.state;

    if (!unsaved) {
      return;
    }

    this._modeling.updateProperties(output, unsaved);

    this.setState({
      unsaved: false
    });
  }

  handleChange = (changes) => {
    this.setState({
      unsaved: {
        ...this.state.unsaved,
        ...changes
      }
    }, this.persistChanges);
  };

  getValue(attr) {
    const { output } = this.props.context;

    const { unsaved } = this.state;

    return (unsaved && unsaved[attr]) || output.get(attr);
  }

  render() {
    return (
      <div className="context-menu-container output-edit">
        <OutputEditor
          name={ this.getValue('name') }
          label={ this.getValue('label') }
          onChange={ this.handleChange } />
      </div>
    );
  }
}