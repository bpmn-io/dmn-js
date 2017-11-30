
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import debounce from 'lodash/debounce';

const DEBOUNCE_TIME = 300;


export default class InputExpressionContextMenuComponent extends Component {
  
  constructor(props) {
    super(props);

    this.onInput = this.onInput.bind(this);
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
          onInput={ debounce(this.onInput, DEBOUNCE_TIME) }
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