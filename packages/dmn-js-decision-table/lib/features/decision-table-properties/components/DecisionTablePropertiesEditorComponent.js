
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { removeSelection, selectNodeContents } from '../../../util/DomUtil';
import { isIdValid } from '../../../util/IdsUtil';

export default class DecisionTablePropertiesComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      nameIsFocussed: false,
      idIsFocussed: false,
      idIsValid: true
    };

    const debounceInput = context.injector.get('debounceInput');

    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.editDecisionTableName = debounceInput(this.editDecisionTableName.bind(this));
    this.editDecisionTableId = debounceInput(this.editDecisionTableId.bind(this));
  }

  editDecisionTableName(name) {
    this._modeling.editDecisionTableName(name);
  }

  editDecisionTableId(id) {
    this._modeling.editDecisionTableId(id);
  }

  onInput(event) {

    if (event.target === this.nameNode) {

      this.editDecisionTableName(htmlToString(event.target.innerHTML));

    } else if (event.target === this.idNode) {

      const root = this._sheet.getRoot(),
            businessObject = root.businessObject;

      const id = htmlToString(event.target.innerHTML);

      // if no error message returned ID is valid
      // isInvalid might return error when ID is equal to ID assigned to decision
      if (!isIdValid(businessObject, id) || businessObject.$parent.id === id) {

        // this should be debounced
        this.editDecisionTableId(id);

        this.idNode.classList.remove('invalid');
      } else {
        this.idNode.classList.add('invalid');
      }

    }
  }

  onFocus(property) {
    this.setState({
      [ `${property}IsFocussed` ]: true
    }, () => {
      selectNodeContents(this[ `${property}Node` ]);
    });
  }

  onBlur(property) {
    this.setState({
      [ `${property}IsFocussed` ]: false
    });

    removeSelection();
  }

  componentWillMount() {
    const { injector } = this.context;

    this._sheet = injector.get('sheet');
    this._modeling = injector.get('modeling');
  }

  render() {
    const nameClassNames = [ 'decision-table-name' ];

    if (this.state.nameIsFocussed) {
      nameClassNames.push('focussed');
    }

    const idClassNames = [ 'decision-table-id' ];

    if (this.state.idIsFocussed) {
      idClassNames.push('focussed');
    }

    const root = this._sheet.getRoot(),
          businessObject = root.businessObject;

    const { id, name } = businessObject.$parent;

    return (
      <header className="decision-table-properties">
        <h3
          contenteditable="true"
          spellcheck="false"
          onFocus={ () => this.onFocus('name') }
          onBlur={ () => this.onBlur('name') }
          onInput={ this.onInput }
          ref={ node => this.nameNode = node }
          dangerouslySetInnerHTML={{ __html: name || (this.state.nameIsFocussed ? '' : '-') }}
          className={ nameClassNames.join(' ') }></h3>
        <h5
          contenteditable="true"
          spellcheck="false"
          onFocus={ () => this.onFocus('id') }
          onBlur={ () => this.onBlur('id') }
          onInput={ this.onInput }
          ref={ node => this.idNode = node }
          dangerouslySetInnerHTML={{ __html: id || (this.state.idIsFocussed ? '' : '-') }}
          className={ idClassNames.join(' ') }></h5>
      </header>
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