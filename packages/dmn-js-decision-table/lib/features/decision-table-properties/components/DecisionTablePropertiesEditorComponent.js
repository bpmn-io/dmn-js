
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

      this.editDecisionTableName(event.target.textContent);
    
    } else if (event.target === this.idNode) {

      const root = this._sheet.getRoot(),
            businessObject = root.businessObject;

      const id = event.target.textContent;

      // if no error message returned ID is valid
      if (!isIdValid(businessObject, id)) {
        
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
          className={ nameClassNames.join(' ') }>{ name || (this.state.nameIsFocussed ? '' : '-') }</h3>
        <h5 
          contenteditable="true"
          spellcheck="false"
          onFocus={ () => this.onFocus('id') }
          onBlur={ () => this.onBlur('id') }
          onInput={ this.onInput }
          ref={ node => this.idNode = node }
          className={ idClassNames.join(' ') }>{ id || (this.state.idIsFocussed ? '' : '-') }</h5>
      </header>
    );
  }
}