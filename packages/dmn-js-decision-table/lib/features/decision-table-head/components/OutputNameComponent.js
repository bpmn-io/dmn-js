
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { removeSelection, selectNodeContents } from '../../../util/DomUtil';


export default class OutputNameComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isFocussed: false
    };

    const debounceInput = context.injector.get('debounceInput');

    this.onContextmenu = this.onContextmenu.bind(this);
    this.onInput = debounceInput(this.onInput.bind(this));
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
  }


  componentWillMount() {
    const { changeSupport, injector } = this.context;

    this._changeSupport = changeSupport;

    this._eventBus = injector.get('eventBus');
    this._modeling = injector.get('modeling');
    
    changeSupport.onElementsChanged(this.props.output.id, this.onElementsChanged);
  }


  componentWillUnmount() {
    this._changeSupport.offElementsChanged(this.props.output.id, this.onElementsChanged);
  }


  onContextmenu(event) {
    const { id } = this.props.output;

    this._eventBus.fire('cell.contextmenu', {
      event,
      node: event.node,
      id
    });
  }


  onInput(event) {
    const { output } = this.props;
    
    this._modeling.editOutputName(output, event.target.textContent);
  }


  onFocus() {
    this.setState({
      isFocussed: true
    }, () => {
      selectNodeContents(this.node);
    });
  }


  onBlur() {
    this.setState({
      isFocussed: false
    });

    removeSelection();
  }


  onElementsChanged() {
    const { isFocussed } = this.state;

    if (!isFocussed) {
      this.forceUpdate();
    }
  }


  render() {
    const { name } = this.props.output;
    const { isFocussed } = this.state;

    const classNames = [ 'output', 'output-name' ];

    if (isFocussed) {
      classNames.push('focussed');
    }

    return (
      <th
        onContextmenu={ this.onContextmenu }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        className={ classNames.join(' ') }
        contentEditable="true"
        spellcheck="false"
        ref={ node => this.node = node }
        onInput={ this.onInput }>{ name || (isFocussed ? '' : '-') }</th>
    );
  }

}