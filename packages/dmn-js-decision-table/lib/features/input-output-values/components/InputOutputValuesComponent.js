
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

// eslint-disable-next-line
import ValuesComponent from './ValuesComponent';

export default class InputOutputValuesComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.onElementsChanged = this.onElementsChanged.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { element } = this.props.context;

    const changeSupport = this._changeSupport = this.context.changeSupport;

    changeSupport.onElementsChanged(element.id, this.onElementsChanged);

    this._modeling = this.context.injector.get('modeling');
  }

  componentWillUnmout() {
    const { element } = this.props.context;

    this._changeSupport.offElementsChanged(element.id, this.onElementsChanged);
  }

  onChange(allowedValues) {
    const { element } = this.props.context;

    if (is(element, 'dmn:LiteralExpression')) {
      this._modeling.editAllowedValues(element.$parent, allowedValues);
    } else {
      this._modeling.editAllowedValues(element, allowedValues);
    }
  }

  render() {
    const { element } = this.props.context;

    const label =
      is(element, 'dmn:LiteralExpression') ?
        'Input Values:' :
        'Output Values:';

    let values;

    if (is(element, 'dmn:LiteralExpression')) {
      values = (element.$parent.inputValues && element.$parent.inputValues.text.length)
        ? element.$parent.inputValues.text.split(',').map(value => value.trim())
        : [];
    } else {
      values = (element.outputValues && element.outputValues.text.length)
        ? element.outputValues.text.split(',').map(value => value.trim())
        : [];
    }

    return (
      element.typeRef === 'string' ?
        <div className="input-output-values-edit">
          { label }
          <ValuesComponent onChange={ this.onChange } values={ values } />
        </div>
        : null
    );
  }
}