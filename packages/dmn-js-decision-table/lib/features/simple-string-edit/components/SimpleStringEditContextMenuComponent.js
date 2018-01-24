
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

// eslint-disable-next-line
import SelectComponent from '../../../components/SelectComponent';

// eslint-disable-next-line
import ListComponent from '../../../components/ListComponent';

// eslint-disable-next-line
import ValidatedTextInputComponent from '../../../components/ValidatedTextInputComponent';

import { isInput } from 'dmn-js-shared/lib/util/ModelUtil';

const DISJUNCTION = 'disjunction',
      NEGATION = 'negation';

const INPUT_VALUES_LABEL = 'Predefined Values',
      OUTPUT_VALUES_LABEL = 'Predefined Values',
      INPUT_ENTRY_VALUES_LABEL = 'Custom Values';

export default class SimpleStringEditContextMenuComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');

    let parsedString = parseString(props.context.element.businessObject.text);

    // could not parse
    if (!parsedString) {
      parsedString = {
        values: [],
        type: 'disjunction'
      };
    }

    const inputOrOutputValues = getInputOrOutputValues(
      props.context.element.col.businessObject
    );

    const filteredValues = parsedString.values.filter(value => {
      return !inputOrOutputValues.includes(value);
    });

    const isInputClause = isInput(props.context.element.col);

    let items = inputOrOutputValues.map(value => {
      return {
        value,
        isChecked: parsedString.values.includes(value),
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
      !inputOrOutputValues.includes(parsedString.values[0])
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
  onUnaryTestsTypeChange(e) {
    const { element } = this.props.context,
          { text } = element.businessObject;

    const { value } = e.target;

    if (value === 'disjunction') {
      this.editCell(
        element.businessObject,
        text
          .replace('not(', '')
          .replace(')', '') || ''
      );

      this.setState({
        unaryTestsType: DISJUNCTION
      });
    } else {
      this.editCell(element.businessObject, `not(${ text || '' })`);

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
    const values = items
      .filter(item => item.isChecked)
      .map(item => item.value);

    const { element } = this.props.context;

    const { context } = this.props;

    const parsedString = parseString(context.element.businessObject.text);

    const type = parsedString ? parsedString.type : DISJUNCTION;

    if (type === 'disjunction') {
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
   * Add unary tests to list.
   */
  addUnaryTestsListItem() {
    const { inputValue, items } = this.state;

    const parsedString = parseString(inputValue);

    if (!parsedString) {
      return;
    }

    const { element } = this.props.context;

    const { context } = this.props,
          { type, values } = parseString(context.element.businessObject.text);

    const newValues = values.concat(parsedString.values);

    if (type === 'disjunction') {
      this.editCell(element.businessObject, newValues.join(','));
    } else {
      this.editCell(element.businessObject, `not(${ newValues.join(',') })`);
    }

    const newItems = items.concat(parsedString.values.map(value => {
      return {
        value,
        isChecked: true,
        isRemovable: true,
        group: 'Input Entry Values'
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
      value: 'disjunction'
    }, {
      label: 'Match none',
      value: 'negation'
    }];

    const isInputClause = isInput(element.col);

    const isNegation = unaryTestsType === NEGATION;

    return (
      <div class="simple-string-edit">

        <div class="heading-medium">Edit String Expression</div>

        {
          isInputClause
            && <SelectComponent
              ref={ node => this.selectNode = node }
              className="margin-top-large full-width display-block"
              onChange={ this.onUnaryTestsTypeChange }
              options={ options }
              value={ isNegation ? 'negation' : 'disjunction' } />
        }

        <ListComponent
          className="margin-top-large"
          onChange={ this.onUnaryTestsListChanged }
          items={ items }
          type={ isInputClause ? 'checkbox' : 'radio' } />

        {
          isInputClause
            ? <div className="heading-small margin-bottom-medium">Add Values</div>
            : <div className="heading-small margin-bottom-medium">Set Value</div>
        }

        <div className="no-wrap">
          {
            !isInputClause
              && !!items.length
              && <input
                checked={ isOutputValueInputChecked }
                className="margin-right-medium cursor-pointer"
                onClick={ this.onOutputValueInputClick }
                type={ isInputClause ? 'checkbox' : 'radio' } />
          }

          <ValidatedTextInputComponent
            onEnter={
              isInputClause ?
                this.addUnaryTestsListItem :
                this.onOutputValueInputClick
            }
            onInputChange={ this.onInput }
            placeholder={ isInputClause ? '"value", "value", ...' : '"value"' }
            validate={ value => {
              if (!parseString(value)) {
                return 'Strings must be in double quotes';
              }
            }}
            value={ inputValue } />
        </div>

      </div>
    );
  }
}

////////// helpers //////////

/**
 * Parse input/output entry string to unary tests and type of unary tests.
 *
 * Example:
 *
 * not("foo", "bar")
 *
 * returns
 *
 * {
 *   type: 'negation',
 *   values: [ "foo", "bar, baz" ]
 * }
 *
 * @param {String} string - Input/Output entry as string e.g. "foo", "bar".
 */
function parseString(string) {

  // empty string or no string at all
  if (!string || isEmptyString(string.trim())) {
    return {
      type: 'disjunction',
      values: []
    };
  }

  // disjunction
  let values = string.split(',');

  const result = {
    type: 'disjunction',
    values: []
  };

  let openString = '';

  values.forEach(value => {
    openString += value;

    if (/^"[^"]*"$/.test(openString.trim())) {
      result.values.push(openString.trim());

      openString = '';
    } else {
      openString += ',';
    }
  });

  if (!openString) {
    return result;
  }

  // negation
  result.type = 'negation';
  result.values = [];

  openString = '';

  const matches = string.match(/^\s*not\((.*)\)\s*$/);

  if (matches) {
    values = matches[1].split(',');

    values.forEach(value => {
      openString += value;

      if (/^"[^"]*"$/.test(openString.trim())) {
        result.values.push(openString.trim());

        openString = '';
      } else {
        openString += ',';
      }
    });

    if (!openString) {
      return result;
    }
  }
}

function isEmptyString(string) {
  return string === '';
}

function getInputOrOutputValues(inputOrOutput) {
  const inputOrOutputValues =
    isInput(inputOrOutput) ?
      inputOrOutput.inputValues :
      inputOrOutput.outputValues;

  if (!inputOrOutputValues) {
    return [];
  }

  return inputOrOutputValues.text.split(',').map(value => value.trim());
}