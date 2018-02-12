import { Component } from 'inferno';


export default class InputExpressionContextMenuComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const debounceInput = context.injector.get('debounceInput');

    this.onInput = debounceInput(this.onInput.bind(this));
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onInput(event) {
    const { inputExpression } = this.props.context;

    this._modeling.editInputExpression(inputExpression, event.target.value);
  }

  onKeyDown(event) {
    if (isEnter(event)) {
      const { inputExpression } = this.props.context;

      this._modeling.editInputExpression(inputExpression, this.node.value);

      this._contextMenu.close();
    }
  }

  componentWillMount() {
    const { injector } = this.context;

    this._modeling = injector.get('modeling');
    this._contextMenu = injector.get('contextMenu');
  }

  render() {
    const { inputExpression } = this.props.context;

    return (
      <div className="input-expression-edit">
        Expression:
        <input
          className="input-expression-edit-input"
          ref={ node => {
            this.node = node;
            node && node.focus();
            node && node.select();
          } }
          type="text"
          placeholder="-"
          spellcheck="false"
          onInput={ this.onInput }
          onKeyDown={ this.onKeyDown }
          value={ inputExpression.text } />
      </div>
    );
  }
}

////////// helpers //////////

function isEnter(event) {
  return event.keyCode === 13;
}