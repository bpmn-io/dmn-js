
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { is } from '../../../util/ModelUtil';

import debounce from 'lodash/debounce';

import { selectNodeContents } from '../../../util/DomUtil';

const DEBOUNCE_TIME = 300;


export default class RulesEditorCellComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isFocussed: false
    };

    this.onInput = this.onInput.bind(this);
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
        onInput={ debounce(this.onInput, DEBOUNCE_TIME) }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        ref={ node => this.node = node }
        className={ className }>{ cell.businessObject.text }</td>
    );
  }
}