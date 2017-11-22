
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import debounce from 'lodash/debounce';

import { selectNodeContents } from '../../../util/DomUtil';

const DEBOUNCE_TIME = 300;

export default class RulesEditorAnnotationCellComponent extends Component {
  
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



  componentWillMount() {
    const { row } = this.props;
    const { changeSupport, injector } = this.context;

    this._modeling = injector.get('modeling');
    
    changeSupport.onElementsChanged(row.id, this.onElementsChanged);
  }


  componentWillUnmount() {
    const { row } = this.props;
    const { changeSupport } = this.context;

    changeSupport.offElementsChanged(row.id, this.onElementsChanged);
  }


  onInput(event) {
    const { row } = this.props;

    this._modeling.editAnnotation(row.businessObject, event.target.textContent);
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


  onElementsChanged() {
    const { isFocussed } = this.state;

    if (!isFocussed) {
      this.forceUpdate();
    }
  }


  render() {
    const { row } = this.props;
    const { businessObject } = row;
    const { isFocussed } = this.state;

    const classNames = [ 'annotation' ];
    
    if (isFocussed) {
      classNames.push('focussed');
    }

    return (
      <td
        contentEditable="true"
        spellcheck="false"
        onInput={ debounce(this.onInput, DEBOUNCE_TIME) }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        ref={ node => this.node = node }
        className={ classNames.join(' ') }>{ businessObject.description || (isFocussed ? '' : '-') }</td>
    );
  }
  
}