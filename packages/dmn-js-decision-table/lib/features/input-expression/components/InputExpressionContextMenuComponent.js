import { Component } from 'inferno';

import InputExpressionEditor from './InputExpressionEditor';


export default class InputExpressionContextMenuComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');
    this._contextMenu = context.injector.get('contextMenu');

    this.state = {};

    const debounceInput = context.injector.get('debounceInput');

    this.persistChanges = debounceInput(this.persistChanges);
  }

  persistChanges = () => {
    const { inputExpression } = this.props.context;

    const { unsaved } = this.state;

    if (!unsaved) {
      return;
    }

    const {
      inputVariable,
      ...inputExpressionProperties
    } = unsaved;

    var changes = { };

    if ('inputVariable' in unsaved) {
      changes.inputVariable = inputVariable;
    }

    if (hasKeys(inputExpressionProperties)) {
      changes.inputExpression = inputExpressionProperties;
    }

    // TODO(nikku): should pass input via props
    // rather than inputExpression
    this._modeling.updateProperties(inputExpression.$parent, changes);

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
    let { inputExpression } = this.props.context;

    const { unsaved } = this.state;

    // input variable stored in parent
    if (attr === 'inputVariable') {
      inputExpression = inputExpression.$parent;
    }

    return (unsaved && unsaved[attr]) || inputExpression.get(attr);
  }

  render() {
    return (
      <div className="context-menu-container input-expression-edit">
        <InputExpressionEditor
          expressionLanguage={ this.getValue('expressionLanguage') }
          inputVariable={ this.getValue('inputVariable') }
          text={ this.getValue('text') }
          onChange={ this.handleChange } />
      </div>
    );
  }
}


// helpers //////////////////////

function hasKeys(obj) {
  return Object.keys(obj).length;
}