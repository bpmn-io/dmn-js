import { Component } from 'inferno';

import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import {
  getComparisonString,
  getRangeString,
  parseString
} from '../Utils';

const COMPARISON = 'comparison',
      RANGE = 'range';


export default class InputNumberEdit extends Component {
  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    const parsedString = parseString(element.businessObject.text);

    if (parsedString) {
      this.state = {
        type: parsedString.type,
        comparisonOperator: parsedString.operator || 'equals',
        comparisonValue: parsedString.value || 0,
        rangeStartValue: parsedString.values ? parsedString.values[0] : 0,
        rangeEndValue: parsedString.values ? parsedString.values[1] : 0,
        rangeStartType: parsedString.start || 'include',
        rangeEndType: parsedString.end || 'include'
      };
    } else {
      this.state = {
        type: COMPARISON,
        comparisonOperator: 'equals',
        comparisonValue: 0,
        rangeStartValue: 0,
        rangeEndValue: 0,
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

        <div className="dms-fill-row">
          <InputSelect
            noInput={ true }
            onChange={ this.onComparisonOperatorChange }
            options={ comparisonOperatorOptions }
            value={ comparisonOperator } />

          &nbsp;

          <Input
            className="comparison-number-input"
            onInput={ this.onComparisonValueChange }
            type="number"
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
        <h4 className="dms-heading">Start Value</h4>

        <div className="dms-fill-row">
          <InputSelect
            noInput={ true }
            onChange={ this.onRangeStartTypeChange }
            options={ rangeTypeOptions }
            value={ rangeStartType } />

          &nbsp;

          <Input
            className="range-start-number-input"
            onInput={ this.onRangeStartValueChange }
            type="number"
            value={ rangeStartValue } />
        </div>

        <h4 className="dms-heading">
          End Value
        </h4>

        <div className="dms-fill-row">
          <InputSelect
            noInput={ true }
            onChange={ this.onRangeEndTypeChange }
            options={ rangeTypeOptions }
            value={ rangeEndType } />

          &nbsp;

          <Input
            className="range-end-number-input"
            onInput={ this.onRangeEndValueChange }
            type="number"
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
      <div class="context-menu-container simple-number-edit">

        <h3 class="dms-heading">Edit Number</h3>

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