import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import List from 'dmn-js-shared/lib/components/List';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import {
  getValuesArray,
  parseString
} from '../Utils';


export default class AllowedValuesEditing extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');

    this._modeling = context.injector.get('modeling');
    this._changeSupport = context.changeSupport;

    const target = this.getAllowedValuesTarget();

    const parsedString = parseString(
      (target.inputValues && target.inputValues.text) ||
      (target.outputValues && target.outputValues.text) ||
      ''
    );

    if (parsedString) {
      this.state = {
        values: parsedString.values.map(value => {
          return {
            value,
            isCheckable: false,
            isRemovable: true,
            group: 'Predefined Values'
          };
        }),
        inputValue: ''
      };
    } else {
      this.state = {
        values: null,
        inputValue: ''
      };
    }
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  componentWillMount() {
    const target = this.getAllowedValuesTarget();

    this._changeSupport.onElementsChanged(target.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const target = this.getAllowedValuesTarget();

    this._changeSupport.offElementsChanged(target.id, this.onElementsChanged);
  }

  setPredefinedValues = (values) => {

    // inputClause or outputClause
    const target = this.getAllowedValuesTarget();

    this.setState({
      values
    });

    this._modeling.editAllowedValues(
      target,
      values && getValuesArray(values)
    );
  }

  onListChange = (values) => {
    this.setPredefinedValues(values);
  }

  getAllowedValuesTarget() {
    const { element } = this.props.context;

    if (is(element, 'dmn:LiteralExpression')) {
      return element.$parent;
    } else {
      return element;
    }
  }

  onInput = ({ isValid, value }) => {
    this.setState({
      inputValue: value
    });
  }

  /**
   * Add new value on ENTER.
   */
  onKeyDown = ({ isValid, event }) => {

    if (!isEnter(event.keyCode)) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    if (isValid) {
      const {
        inputValue,
        values
      } = this.state;

      const parsedString = parseString(inputValue);

      this.onListChange((values || []).concat(parsedString.values.map(value => {
        return {
          value,
          isCheckable: false,
          isRemovable: true,
          group: 'Predefined Values'
        };
      })));

      this.setState({
        inputValue: ''
      });

    }
  }

  handleRemovePredifinedValuesClick = (e) => {
    e.stopPropagation();

    this.removePredefinedValues();
  }

  removePredefinedValues = () => {
    this.setPredefinedValues(null);
  }

  render() {
    const { element } = this.props.context;

    const {
      inputValue,
      values
    } = this.state;

    return (
      element.typeRef === 'string' ?
        <div className="context-menu-container allowed-values-edit">
          <hr className="dms-hrule" />
          {
            !isNull(values)
              && values.length > 0
              && <List
                items={ values }
                onChange={ this.onListChange } />
          }

          {
            !isNull(values)
              && !values.length
              && <div>
                <h4 className="dms-heading">
                  { this._translate('Predefined Values') }
                </h4>
                <span className="placeholder">
                  { this._translate('No values') }
                </span>
              </div>
          }

          {
            !isNull(values)
              && <p class="dms-hint">
                <button type="button" className="del-values"
                  onClick={ this.handleRemovePredifinedValuesClick }>
                  { this._translate('Clear predefined values.') }
                </button>
              </p>
          }

          <h4 className="dms-heading">
            { this._translate('Add Predefined Values') }
          </h4>

          <ValidatedInput
            onInput={ this.onInput }
            onKeyDown={ this.onKeyDown }
            placeholder={ '"value", "value", ...' }
            type="text"
            validate={ value => {
              if (!parseString(value)) {
                return this._translate('Strings must be in double quotes.');
              }
            } }
            value={ inputValue } />

        </div>
        : null
    );
  }
}


// helpers //////////////////////

function isEnter(keyCode) {
  return keyCode === 13;
}

function isNull(value) {
  return value === null;
}