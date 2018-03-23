import { Component } from 'inferno';

import OutputEditor from './OutputEditor';

import {
  inject,
  mixin
} from 'table-js/lib/components';

import CloseBehavior from './CloseBehavior';


export default class OutputCellContextMenu extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {};

    mixin(this, CloseBehavior);

    inject(this);

    this.persistChanges = this.debounceInput(this.persistChanges);
  }

  persistChanges = () => {
    const { output } = this.props.context;

    const { unsaved } = this.state;

    if (!unsaved) {
      return;
    }

    this.modeling.updateProperties(output, unsaved);

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
      <div
        className="context-menu-container output-edit"
        { ...this.getCloseProps() }
      >
        <OutputEditor
          name={ this.getValue('name') }
          label={ this.getValue('label') }
          onChange={ this.handleChange } />
      </div>
    );
  }
}

OutputCellContextMenu.$inject = [
  'debounceInput',
  'modeling'
];