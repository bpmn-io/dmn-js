// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import escapeHtml from 'escape-html';


export default class ContentEditable extends Component {

  constructor(props, context) {
    super(props, context);

    this.onFocus = this.onFocus.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }


  shouldComponentUpdate(nextProps) {
    return nextProps.text !== this.node.innerText;
  }


  onFocus() {
    var propsFocus = this.props.onFocus;

    if (typeof propsFocus === 'function') {
      propsFocus();
    }
  }


  onBlur() {
    var propsBlur = this.props.onBlur;

    if (typeof propsBlur === 'function') {
      propsBlur();
    }
  }

  onInput(event) {
    var propsInput = this.props.onInput;

    if (typeof propsInput !== 'function') {
      return;
    }

    var text = event.target.innerText;

    propsInput(text);
  }


  render(props) {

    var {
      text,
      className
    } = props;

    return (
      <div
        className={ [ className || '', 'content-editable' ].join(' ') }
        contentEditable="true"
        spellcheck="false"
        onInput={ this.onInput }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        ref={ node => this.node = node }
        dangerouslySetInnerHTML={{ __html: escapeHtml(text) }}></div>
    );
  }

}
