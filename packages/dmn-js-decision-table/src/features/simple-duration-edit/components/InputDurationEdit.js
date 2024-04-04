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

    this._translate = context.injector.get('translate');
    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    this._type = getTypeRef(element);

    const parsedString = parseDuration(element.businessObject.text, this._type);

    if (parsedString) {
      this.state = {
        type: parsedString.type,
        comparisonOperator: parsedString.operator || 'equals',
        startValue: parsedString.values[0] || '',
        endValue: parsedString.values[1] || '',
        rangeStartType: parsedString.start || 'include',
        rangeEndType: parsedString.end || 'include'
      };
    } else {
      this.state = {
        type: COMPARISON,
        comparisonOperator: 'equals',
        startValue: '',
        endValue: '',
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
      startValue,
      endValue,
      rangeStartType,
      rangeEndType
    } = this.state;

    if (value === COMPARISON) {
      this.editCell(
        element.businessObject,
        getComparisonString(comparisonOperator, startValue)
      );
    } else {
      this.editCell(
        element.businessObject,
        getRangeString(startValue, endValue, rangeStartType, rangeEndType)
      );
    }

    this.setState({
      type: value
    });
  }

  onComparisonOperatorChange(value) {
    const { element } = this.props.context;

    const { type, startValue } = this.state;

    if (type === COMPARISON) {
      this.editCell(element.businessObject, getComparisonString(value, startValue));

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
        startValue: comparisonValue
      });
    }
  }

  onRangeStartTypeChange(value) {
    const { element } = this.props.context;

    const { type, startValue, endValue, rangeEndType } = this.state;

    if (type === RANGE) {
      this.editCell(
        element.businessObject,
        getRangeString(startValue, endValue, value, rangeEndType)
      );

      this.setState({
        rangeStartType: value
      });
    }
  }

  onRangeStartValueChange(value) {
    const { element } = this.props.context;

    const { type, endValue, rangeStartType, rangeEndType } = this.state;

    if (type === RANGE) {
      this.editCell(
        element.businessObject,
        getRangeString(value, endValue, rangeStartType, rangeEndType)
      );

      this.setState({
        startValue: value
      });
    }
  }

  onRangeEndTypeChange(value) {
    const { element } = this.props.context;

    const { type, startValue, endValue, rangeStartType } = this.state;

    if (type === RANGE) {
      this.editCell(
        element.businessObject,
        getRangeString(startValue, endValue, rangeStartType, value)
      );

      this.setState({
        rangeEndType: value
      });
    }
  }

  onRangeEndValueChange(value) {
    const { element } = this.props.context;

    const { type, startValue, rangeStartType, rangeEndType } = this.state;

    if (type === RANGE) {
      this.editCell(
        element.businessObject,
        getRangeString(startValue, value, rangeStartType, rangeEndType)
      );

      this.setState({
        endValue: value
      });
    }
  }

  renderComparison(comparisonOperator, comparisonValue) {
    const comparisonOperatorOptions = [ {
      label: this._translate('Equals'),
      value: 'equals'
    }, {
      label: this._translate('Less'),
      value: 'less'
    }, {
      label: this._translate('Less or equals'),
      value: 'lessEquals'
    }, {
      label: this._translate('Greater'),
      value: 'greater'
    }, {
      label: this._translate('Greater or equals'),
      value: 'greaterEquals'
    } ];

    return (
      <div className="comparison">

        <h4 className="dms-heading">Value</h4>

        <div className="dms-fill-row dms-input-duration-edit-row">
          <InputSelect
            label={ this._translate('Comparison operator') }
            noInput={ true }
            onChange={ this.onComparisonOperatorChange }
            options={ comparisonOperatorOptions }
            value={ comparisonOperator } />

          &nbsp;

          <DurationInput
            label={ this._translate('Duration value') }
            type={ this._type }
            className="comparison-duration-input"
            onInput={ this.onComparisonValueChange }
            value={ comparisonValue } />
        </div>

      </div>
    );
  }

  renderRange(rangeStartValue, rangeEndValue, rangeStartType, rangeEndType) {
    const rangeTypeOptions = [ {
      label: this._translate('Include'),
      value: 'include'
    }, {
      label: this._translate('Exclude'),
      value: 'exclude'
    } ];

    return (
      <div className="range">
        <h4 className="dms-heading">{ this._translate('Start value') }</h4>

        <div className="dms-fill-row dms-input-duration-edit-row">
          <InputSelect
            label={ this._translate('Range start operator') }
            noInput={ true }
            onChange={ this.onRangeStartTypeChange }
            options={ rangeTypeOptions }
            value={ rangeStartType } />

          &nbsp;

          <DurationInput
            label={ this._translate('Range start value') }
            type={ this._type }
            className="range-start-duration-input"
            onInput={ this.onRangeStartValueChange }
            value={ rangeStartValue } />
        </div>

        <h4 className="dms-heading">
          { this._translate('End value') }
        </h4>

        <div className="dms-fill-row dms-input-duration-edit-row">
          <InputSelect
            label={ this._translate('Range end operator') }
            noInput={ true }
            onChange={ this.onRangeEndTypeChange }
            options={ rangeTypeOptions }
            value={ rangeEndType } />

          &nbsp;

          <DurationInput
            label={ this._translate('Range end value') }
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
      startValue,
      endValue,
      rangeStartType,
      rangeEndType
    } = this.state;

    const typeOptions = [ {
      label: this._translate('Comparison'),
      value: COMPARISON
    }, {
      label: this._translate('Range'),
      value: RANGE
    } ];

    return (
      <div class="context-menu-container simple-duration-edit">

        <h3 class="dms-heading">{ this._translate('Edit duration') }</h3>

        <div className="dms-fill-row">
          <InputSelect
            label={ this._translate('Test type') }
            noInput={ true }
            onChange={ this.onTypeChange }
            options={ typeOptions }
            value={ type } />
        </div>

        {
          type === COMPARISON
            && this.renderComparison(comparisonOperator, startValue)
        }

        {
          type === RANGE
            && this.renderRange(
              startValue,
              endValue,
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
