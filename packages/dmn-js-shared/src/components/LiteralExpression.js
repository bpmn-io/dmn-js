import { Component } from 'inferno';

import FeelEditor from '@bpmn-io/feel-editor';

export default class LiteralExpression extends Component {

  constructor(props, context) {
    super(props, context);

    this.node = null;
    this.editor = null;
  }

  componentDidMount() {
    this.editor = new FeelEditor({
      container: this.node,
      onChange: this.props.onInput,
      value: this.props.value
    });
  }

  handleMouseEvent = (event) => {
    event.stopPropagation();
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  render() {
    return (
      <div
        className={ this.props.className || '' }
        ref={ node => this.node = node }
        onClick={ this.handleMouseEvent }
        onMouseDown={ this.handleMouseEvent }
        onKeyDown={ this.handleKeyDown }
        onFocus={ this.props.onFocus }
        onBlur={ this.props.onBlur }
      />
    );
  }
}
