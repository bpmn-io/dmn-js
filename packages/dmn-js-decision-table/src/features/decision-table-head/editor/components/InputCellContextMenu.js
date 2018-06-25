import { Component } from 'inferno';

import InputEditor from './InputEditor';

import {
  inject
} from 'table-js/lib/components';


export default class InputCellContextMenu extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {};

    inject(this);

    this.persistChanges = this.debounceInput(this.persistChanges);
  }

  persistChanges = () => {
    const { input } = this.props.context;

    const { unsaved } = this.state;

    if (!unsaved) {
      return;
    }

    const {
      inputVariable,
      label,
      ...inputExpressionProperties
    } = unsaved;

    var changes = { };

    if ('inputVariable' in unsaved) {
      changes.inputVariable = inputVariable;
    }

    if ('label' in unsaved) {
      changes.label = label;
    }

    if (hasKeys(inputExpressionProperties)) {
      changes.inputExpression = inputExpressionProperties;
    }

    this.modeling.updateProperties(input, changes);

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
    let { input } = this.props.context;

    const { unsaved } = this.state;

    let target = input;

    // input variable stored in parent
    if (attr === 'expressionLanguage' || attr === 'text') {
      target = target.inputExpression;
    }

    return (unsaved && unsaved[attr]) || target.get(attr);
  }

  render() {
    return (
      <div className="context-menu-container input-edit">
        <InputEditor
          expressionLanguage={ this.getValue('expressionLanguage') }
          inputVariable={ this.getValue('inputVariable') }
          label={ this.getValue('label') }
          text={ this.getValue('text') }
          onChange={ this.handleChange } />
      </div>
    );
  }
}

InputCellContextMenu.$inject = [
  'debounceInput',
  'modeling'
];


// helpers //////////////////////

function hasKeys(obj) {
  return Object.keys(obj).length;
}