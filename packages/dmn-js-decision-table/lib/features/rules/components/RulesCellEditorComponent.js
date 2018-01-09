
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { removeSelection, selectNodeContents } from '../../../util/DomUtil';


export default class RulesEditorCellComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isFocussed: false
    };

    const debounceInput = context.injector.get('debounceInput');

    this.onInput = debounceInput(this.onInput.bind(this));
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onElementsChanged() {
    const { isFocussed } = this.state;

    if (!isFocussed) {
      this.forceUpdate();
    }
  }

  componentWillMount() {
    const { injector } = this.context;

    const { cell } = this.props;

    const changeSupport = this._changeSupport = this.context.changeSupport;

    this._modeling = injector.get('modeling');

    changeSupport.onElementsChanged(cell.id, this.onElementsChanged);
  }


  componentWillUnmount() {
    const { cell } = this.props;

    this._changeSupport.offElementsChanged(cell.id, this.onElementsChanged);
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


  onInput(event) {
    const { cell } = this.props;

    this._modeling.editCell(cell.businessObject, event.target.textContent);
  }


  render() {
    const { cell } = this.props;

    const className = is(cell, 'dmn:UnaryTests') ? 'input' : 'output';

    return (
      <td
        data-element-id={ cell.id }
        contentEditable="true"
        spellcheck="false"
        onInput={ this.onInput }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        ref={ node => this.node = node }
        className={ className }>{ cell.businessObject.text }</td>
    );
  }
}