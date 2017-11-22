
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import debounce from 'lodash/debounce';

const DEBOUNCE_TIME = 300;

import { selectNodeContents } from '../../../util/DomUtil';

export default class DecisionTablePropertiesComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: {
        isFocussed: false
      },
      id: {
        isFocussed: false
      }
    };

    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onInput(event) {
    if (event.target === this.nameNode) {
      this._modeling.editDecisionTableName(event.target.textContent);
    } else if (event.target === this.idNode) {
      this._modeling.editDecisionTableId(event.target.textContent);
    }
  }

  onFocus(property) {
    this.setState({
      [ property ]: {
        isFocussed: true
      }
    }, () => {
      selectNodeContents(this[ `${property}Node` ]);
    });
  }

  onBlur(property) {
    this.setState({
      [ property ]: {
        isFocussed: false
      }
    });
  }
  
  componentWillMount() {
    const { injector } = this.context;

    this._sheet = injector.get('sheet');
    this._modeling = injector.get('modeling');
  }

  render() {
    const nameClassNames = [ 'decision-table-name' ];

    if (this.state.name.isFocussed) {
      nameClassNames.push('focussed');
    }

    const idClassNames = [ 'decision-table-id' ];
    
    if (this.state.id.isFocussed) {
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
          onInput={ debounce(this.onInput, DEBOUNCE_TIME) }
          ref={ node => this.nameNode = node }
          className={ nameClassNames.join(' ') }>{ name }</h3>
        <h5 
          contenteditable="true"
          spellcheck="false"
          onFocus={ () => this.onFocus('id') }
          onBlur={ () => this.onBlur('id') }
          onInput={ debounce(this.onInput, DEBOUNCE_TIME) }
          ref={ node => this.idNode = node }
          className={ idClassNames.join(' ') }>{ id }</h5>
      </header>
    );
  }
}