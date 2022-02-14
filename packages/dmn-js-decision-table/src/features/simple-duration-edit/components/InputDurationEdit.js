import { Component } from 'inferno';

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { DurationInput } from './DurationInput';

import {
  getComparisonString,
  getRangeString,
  parseDuration
} from '../Utils';

const COMPARISON = 'comparison',
      RANGE = 'range';

// adapted from InputNumberEdit
export default class InputDurationEdit extends Component {
  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    this._type = getTypeRef(element);

    const parsedString = parseDuration(element.businessObject.text, this._type);

    if (parsedString) {
      this.state = {
        type: parsedString.type,
        comparisonOperator: parsedString.operator || 'equals',
        comparisonValue: parsedString.value || '',
        rangeStartValue: parsedString.values ? parsedString.values[0] : '',
        rangeEndValue: parsedString.values ? parsedString.values[1] : '',
        rangeStartType: parsedString.start || 'include',
        rangeEndType: parsedString.end || 'include'
      };
    } else {
      this.state = {
        type: COMPARISON,
        comparisonOperator: 'equals',
        comparisonValue: '',
        rangeStartValue: '',
        rangeEndValue: '',
        rangeStartType: 'include',
        rangeEndType: 'include'
      };
    }

    const debounceInput = context.injector.get('debounceInput');

    this.debouncedEditCell = debounceInput(this.editCell.bind(this));
    this.editCell = this.editCell.bind(this);

    this.onComparisonOperatorChange = this.onComparisonOperatorChange.bind(this);
    this.onComparisonValueChange = this.onComparisonValueChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onRangeStartTypeChange = this.onRangeStartTypeChange.bind(this);
    this.onRangeStartValueChange = this.onRangeStartValueChange.bind(this);
    this.onRangeEndTypeChange = this.onRangeEndTypeChange.bind(this);
    this.onRangeEndValueChange = this.onRangeEndValueChange.bind(this);
  }

  editCell(cell, text) {
    this._modeling.editCell(cell, text);
  }

  onTypeChange(value) {
    const { element } = this.props.context;

    const {
      comparisonOperator,
      comparisonValue,
      rangeStartValue,
      rangeEndValue,
      rangeStartType,
      rangeEndType
    } = this.state;

    if (value === COMPARISON) {
      this.editCell(
        element.businessObject,
        getComparisonString(comparisonOperator, comparisonValue)
      );
    } else {
      this.editCell(
        element.businessObject,
        getRangeString(rangeStartValue, rangeEndValue, rangeStartType, rangeEndType)
      );
    }

    this.setState({
      type: value
    });
  }

  onComparisonOperatorChange(value) {
    const { element } = this.props.context;

    const { type, comparisonValue } = this.state;

    if (type === COMPARISON) {
      this.editCell(element.businessObject, getComparisonString(value, comparisonValue));

      this.setState({
        comparisonOperator: value
      });
    }
  }

  onComparisonValueChange(comparisonValue) {
    const { element } = this.props.context;

    const { type, comparisonOperator } = this.state;

    if (type === COMPARISON) {
      this.debouncedEditCell(
        element.businessObject,
        getComparisonString(comparisonOperator, comparisonValue)
      );

      this.setState({
        comparisonValue
      });
    }
  }

  onRangeStartTypeChange(value) {
    const { element } = this.props.context;

    const { type, rangeStartValue, rangeEndValue, rangeEndType } = this.state;

    if (type === RANGE) {
      this.editCell(
        element.businessObject,
        getRangeString(rangeStartValue, rangeEndValue, value, rangeEndType)
      );

      this.setState({
        rangeStartType: value
      });
    }
  }

  onRangeStartValueChange(value) {
    const { element } = this.props.context;

    const { type, rangeEndValue, rangeStartType, rangeEndType } = this.state;

    if (type === RANGE) {
      this.editCell(
        element.businessObject,
        getRangeString(value, rangeEndValue, rangeStartType, rangeEndType)
      );

      this.setState({
        rangeStartValue: value
      });
    }
  }

  onRangeEndTypeChange(value) {
    const { element } = this.props.context;

    const { type, rangeStartValue, rangeEndValue, rangeStartType } = this.state;

    if (type === RANGE) {
      this.editCell(
        element.businessObject,
        getRangeString(rangeStartValue, rangeEndValue, rangeStartType, value)
      );

      this.setState({
        rangeEndType: value
      });
    }
  }

  onRangeEndValueChange(value) {
    const { element } = this.props.context;

    const { type, rangeStartValue, rangeStartType, rangeEndType } = this.state;

    if (type === RANGE) {
      this.editCell(
        element.businessObject,
        getRangeString(rangeStartValue, value, rangeStartType, rangeEndType)
      );

      this.setState({
        rangeEndValue: value
      });
    }
  }

  renderComparison(comparisonOperator, comparisonValue) {
    const comparisonOperatorOptions = [{
      label: 'Equals',
      value: 'equals'
    }, {
      label: 'Less',
      value: 'less'
    }, {
      label: 'Less or equals',
      value: 'lessEquals'
    }, {
      label: 'Greater',
      value: 'greater'
    }, {
      label: 'Greater or equals',
      value: 'greaterEquals'
    }];

    return (
      <div className="comparison">

        <h4 className="dms-heading">Value</h4>

        <div className="dms-fill-row dms-input-duration-edit-row">
          <InputSelect
            noInput={ true }
            onChange={ this.onComparisonOperatorChange }
            options={ comparisonOperatorOptions }
            value={ comparisonOperator } />

          &nbsp;

          <DurationInput
            type={ this._type }
            className="comparison-duration-input"
            onInput={ this.onComparisonValueChange }
            value={ comparisonValue } />
        </div>

      </div>
    );
  }

  renderRange(rangeStartValue, rangeEndValue, rangeStartType, rangeEndType) {
    const rangeTypeOptions = [{
      label: 'Include',
      value: 'include'
    }, {
      label: 'Exclude',
      value: 'exclude'
    }];

    return (
      <div className="range">
        <h4 className="dms-heading">Start value</h4>

        <div className="dms-fill-row dms-input-duration-edit-row">
          <InputSelect
            noInput={ true }
            onChange={ this.onRangeStartTypeChange }
            options={ rangeTypeOptions }
            value={ rangeStartType } />

          &nbsp;

          <DurationInput
            type={ this._type }
            className="range-start-duration-input"
            onInput={ this.onRangeStartValueChange }
            value={ rangeStartValue } />
        </div>

        <h4 className="dms-heading">
          End value
        </h4>

        <div className="dms-fill-row dms-input-duration-edit-row">
          <InputSelect
            noInput={ true }
            onChange={ this.onRangeEndTypeChange }
            options={ rangeTypeOptions }
            value={ rangeEndType } />

          &nbsp;

          <DurationInput
            type={ this._type }
            className="range-end-duration-input"
            onInput={ this.onRangeEndValueChange }
            value={ rangeEndValue } />
        </div>

      </div>
    );
  }

  render() {
    const {
      type,
      comparisonOperator,
      comparisonValue,
      rangeStartValue,
      rangeEndValue,
      rangeStartType,
      rangeEndType
    } = this.state;

    const typeOptions = [{
      label: 'Comparison',
      value: COMPARISON
    }, {
      label: 'Range',
      value: RANGE
    }];

    return (
      <div class="context-menu-container simple-duration-edit">

        <h3 class="dms-heading">Edit duration</h3>

        <div className="dms-fill-row">
          <InputSelect
            noInput={ true }
            onChange={ this.onTypeChange }
            options={ typeOptions }
            value={ type } />
        </div>

        {
          type === COMPARISON
            && this.renderComparison(comparisonOperator, comparisonValue)
        }

        {
          type === RANGE
            && this.renderRange(
              rangeStartValue,
              rangeEndValue,
              rangeStartType,
              rangeEndType
            )
        }

      </div>
    );
  }
}


function getTypeRef(element) {
  return element.col.businessObject.inputExpression.typeRef;
}
