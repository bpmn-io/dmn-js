import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import ListComponent from 'dmn-js-shared/lib/components/ListComponent';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import { getValuesArray, parseString } from '../Utils';


export default class InputOutputValuesComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    const isInput = is(element, 'dmn:LiteralExpression');

    const parsedString = parseString(
      (isInput
        ? (element.$parent.inputValues && element.$parent.inputValues.text)
        : element.outputValues && element.outputValues.text) || '');

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

    this.onElementsChanged = this.onElementsChanged.bind(this);
    this.onListChange = this.onListChange.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.removePredefinedValues = this.removePredefinedValues.bind(this);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { element } = this.props.context;

    const changeSupport = this._changeSupport = this.context.changeSupport;

    changeSupport.onElementsChanged(element.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const { element } = this.props.context;

    this._changeSupport.offElementsChanged(element.id, this.onElementsChanged);
  }

  onListChange(values) {
    const { element } = this.props.context;

    this.setState({
      values
    });

    if (is(element, 'dmn:LiteralExpression')) {
      this._modeling.editAllowedValues(element.$parent, getValuesArray(values));
    } else {
      this._modeling.editAllowedValues(element, getValuesArray(values));
    }
  }

  onInput({ isValid, value }) {
    this.setState({
      inputValue: value
    });
  }

  /**
   * Add new value on ENTER.
   */
  onKeyDown({ isValid, event }) {
    if (isEnter(event.keyCode) && isValid) {

      const { inputValue, values } = this.state;

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

  removePredefinedValues() {
    const { element } = this.props.context;

    this.setState({
      values: null
    });

    if (is(element, 'dmn:LiteralExpression')) {
      this._modeling.editAllowedValues(element.$parent, null);
    } else {
      this._modeling.editAllowedValues(element, null);
    }
  }

  render() {
    const { element } = this.props.context;

    const { inputValue, values } = this.state;

    return (
      element.typeRef === 'string' ?
        <div className="context-menu-container input-output-values-edit">

          {
            !isNull(values)
              && values.length > 0
              && <ListComponent
                items={ values }
                onChange={ this.onListChange } />
          }

          {
            !isNull(values)
              && !values.length
              && <div>
                <h4 className="dms-heading">
                  Predefined Values
                </h4>
                <span className="placeholder">No values</span>
              </div>
          }

          {
            !isNull(values)
              && <p class="dms-hint">
                <a href="#" className="del-values"
                  onMouseUp={ this.removePredefinedValues }>
                  Remove all predefined values.
                </a>
              </p>
          }

          <h4 className="dms-heading">
            Add Predefined Values
          </h4>

          <ValidatedInput
            onInput={ this.onInput }
            onKeyDown={ this.onKeyDown }
            placeholder={ '"value", "value", ...' }
            type="text"
            validate={ value => {
              if (!parseString(value)) {
                return 'Strings must be in double quotes.';
              }
            }}
            value={ inputValue } />

        </div>
        : null
    );
  }
}

////////// helpers //////////

function isEnter(keyCode) {
  return keyCode === 13;
}

function isNull(value) {
  return value === null;
}