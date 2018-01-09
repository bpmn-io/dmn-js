
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { removeSelection, selectNodeContents } from '../../../util/DomUtil';

export default class RulesEditorAnnotationCellComponent extends Component {

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

    this._modeling.editAnnotation(row.businessObject, htmlToString(event.target.innerHTML));
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
    }, removeSelection);
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
        onInput={ this.onInput }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        ref={ node => this.node = node }
        dangerouslySetInnerHTML={{ __html: businessObject.description || (isFocussed ? '' : '-') }}
        className={ classNames.join(' ') }></td>
    );
  }

}

////////// helpers //////////

function htmlToString(html) {
  return html
    .replace(/<div><br><\/div>/ig, '\n')  // replace div with a br with single linebreak
    .replace(/<br(\s*)\/*>/ig, '\n')      // replace single line-breaks
    .replace(/<(div|p)(\s*)\/*>/ig, '\n') // add a line break before all div and p tags
    .replace(/&nbsp;/ig, ' ')             // replace non breaking spaces with normal spaces
    .replace(/(<([^>]+)>)/ig, '');        // remove any remaining tags
}