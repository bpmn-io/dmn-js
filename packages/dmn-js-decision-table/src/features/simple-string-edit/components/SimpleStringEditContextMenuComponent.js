import { Component } from 'inferno';

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import List from 'dmn-js-shared/lib/components/List';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import { isInput } from 'dmn-js-shared/lib/util/ModelUtil';

import { getInputOrOutputValues, parseString } from '../Utils';

const DISJUNCTION = 'disjunction',
      NEGATION = 'negation';

const INPUT_VALUES_LABEL = 'Predefined Values',
      OUTPUT_VALUES_LABEL = 'Predefined Values',
      INPUT_ENTRY_VALUES_LABEL = 'Custom Values';


export default class SimpleStringEditContextMenuComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._modeling = context.injector.get('modeling');

    let parsedString = parseString(props.context.element.businessObject.text);

    // could not parse
    if (!parsedString) {
      parsedString = {
        values: [],
        type: DISJUNCTION
      };
    }

    const inputOrOutputValues = getInputOrOutputValues(
      props.context.element.col.businessObject
    );

    const filteredValues = parsedString.values.filter(value => {
      return !includes(inputOrOutputValues, value);
    });

    const isInputClause = isInput(props.context.element.col);

    let items = inputOrOutputValues.map(value => {
      return {
        value,
        isChecked: includes(parsedString.values, value),
        isRemovable: false,
        group: isInputClause ? INPUT_VALUES_LABEL : OUTPUT_VALUES_LABEL
      };
    });

    if (isInputClause) {
      items = items.concat(filteredValues.map(value => {
        return {
          value,
          isChecked: true,
          isRemovable: true,
          group: INPUT_ENTRY_VALUES_LABEL
        };
      }));
    }

    let inputValue = '';

    if (
      !isInputClause && parsedString.values.length &&
      !includes(inputOrOutputValues, parsedString.values[0])
    ) {
      inputValue = parsedString.values[0];
    }

    this.state = {
      items,
      unaryTestsType: parsedString.type,
      inputValue,
      isOutputValueInputChecked: inputValue !== ''
    };

    const debounceInput = context.injector.get('debounceInput');

    this.debouncedEditCell = debounceInput(this.editCell.bind(this));
    this.editCell = this.editCell.bind(this);
    this.addUnaryTestsListItem = this.addUnaryTestsListItem.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onOutputValueInputClick = this.onOutputValueInputClick.bind(this);
    this.onUnaryTestsListChanged = this.onUnaryTestsListChanged.bind(this);
    this.onUnaryTestsTypeChange = this.onUnaryTestsTypeChange.bind(this);
  }

  editCell(cell, text) {
    this._modeling.editCell(cell, text);
  }

  /**
   * Change type of unary tests.
   */
  onUnaryTestsTypeChange(value) {
    const { items } = this.state;

    const values = getValues(items);

    const { element } = this.props.context;

    if (value === DISJUNCTION) {
      this.editCell(
        element.businessObject,
        values.join(',')
      );

      this.setState({
        unaryTestsType: DISJUNCTION
      });
    } else {
      this.editCell(element.businessObject, `not(${ values.join(',') })`);

      this.setState({
        unaryTestsType: NEGATION
      });
    }
  }

  /**
   * Change list of unary tests.
   */
  onUnaryTestsListChanged(items) {

    // get checked items
    const values = getValues(items);

    const { element } = this.props.context;

    const { unaryTestsType } = this.state;

    if (unaryTestsType === DISJUNCTION) {
      this.editCell(element.businessObject, values.join(','));
    } else {
      this.editCell(element.businessObject, `not(${ values.join(',') })`);
    }

    this.setState({
      items,
      isOutputValueInputChecked: false
    });
  }

  /**
   * Set output value to input value.
   */
  onOutputValueInputClick() {
    const { element } = this.props.context;

    const { inputValue, items } = this.state;

    const parsedString = parseString(inputValue);

    if (!parsedString || parsedString.values.length > 1) {
      return;
    }

    this.editCell(element.businessObject, `${ parsedString.values.join('') }`);

    // uncheck all other values
    this.setState({
      items: items.map(item => {
        item.isChecked = false;

        return item;
      }),
      isOutputValueInputChecked: true
    });
  }

  /**
   * Set output value if valid.
   */
  onInput({ isValid, value }) {
    const { isOutputValueInputChecked } = this.state;

    this.setState({
      inputValue: value
    });

    const { element } = this.props.context;

    if (!isInput(element) && isValid && isOutputValueInputChecked) {
      this.debouncedEditCell(element.businessObject, value);
    }
  }

  /**
   * Add new value on ENTER.
   */
  onKeyDown({ isValid, event }) {

    if (!isEnter(event.keyCode)) {
      return;
    }

    const { element } = this.props.context;

    const isInputClause = isInput(element.col);

    // stop ENTER propagation (and ContextMenu close)
    if (isInputClause || !isValid) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (isValid) {
      if (isInputClause) {
        this.addUnaryTestsListItem();
      } else {
        this.onOutputValueInputClick();
      }
    }
  }

  /**
   * Add unary tests to list.
   */
  addUnaryTestsListItem() {
    const { inputValue, items, unaryTestsType } = this.state;

    const parsedInput = parseString(inputValue);

    if (!parsedInput) {
      return;
    }

    const { element } = this.props.context;

    const values = getValues(items);

    const newValues = [].concat(
      values,
      parsedInput.values
    );

    if (unaryTestsType === DISJUNCTION) {
      this.editCell(element.businessObject, newValues.join(','));
    } else {
      this.editCell(element.businessObject, `not(${ newValues.join(',') })`);
    }

    const newItems = items.concat(parsedInput.values.map(value => {
      return {
        value,
        isChecked: true,
        isRemovable: true,
        group: 'Custom Values'
      };
    }));

    this.setState({
      items: newItems,
      inputValue: ''
    });
  }

  render() {
    const { element } = this.props.context;

    const { inputValue, isOutputValueInputChecked, items, unaryTestsType } = this.state;

    const options = [{
      label: 'Match one',
      value: DISJUNCTION
    }, {
      label: 'Match none',
      value: NEGATION
    }];

    const isInputClause = isInput(element.col);

    const isNegation = unaryTestsType === NEGATION;

    const showRadio = !isInputClause && items.length > 0;

    return (
      <div class="simple-string-edit context-menu-container">

        <h3 class="dms-heading">
          { this._translate('Edit String') }
        </h3>

        {
          isInputClause &&
            <p>
              <InputSelect
                noInput={ true }
                ref={ node => this.selectNode = node }
                onChange={ this.onUnaryTestsTypeChange }
                options={ options }
                value={ isNegation ? NEGATION : DISJUNCTION } />
            </p>
        }

        <List
          onChange={ this.onUnaryTestsListChanged }
          items={ items }
          type={ isInputClause ? 'checkbox' : 'radio' } />

        {
          isInputClause
            ? <h4 className="dms-heading">
              { this._translate('Add Values') }
            </h4>
            : <h4 className="dms-heading">
              { this._translate('Set Value') }
            </h4>
        }

        <div className="dms-fill-row">
          {
            showRadio && <input
              checked={ isOutputValueInputChecked }
              className="cursor-pointer"
              onClick={ this.onOutputValueInputClick }
              type="radio"
              style={ {
                marginRight: '8px'
              } } />
          }

          <ValidatedInput
            className="dms-block"
            onKeyDown={ this.onKeyDown }
            onInput={ this.onInput }
            placeholder={ isInputClause ? '"value", "value", ...' : '"value"' }
            type="text"
            validate={ value => {
              if (!parseString(value)) {
                return this._translate('Strings must be in double quotes.');
              }
            } }
            value={ inputValue } />
        </div>

      </div>
    );
  }
}


// helpers //////////////////////

function isEnter(keyCode) {
  return keyCode === 13;
}

/**
 * Get array of actual values from array of items.
 *
 * @param {Array} items - Array of items.
 */
function getValues(items) {
  return items
    .filter(item => item.isChecked)
    .map(item => item.value);
}

function includes(array, value) {
  return array.indexOf(value) !== -1;
}