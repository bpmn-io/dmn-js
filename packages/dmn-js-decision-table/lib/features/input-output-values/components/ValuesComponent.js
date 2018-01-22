// TODO(philippfromme): refactor into generic component

// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { uniq } from 'lodash';
import { classes as domClasses } from 'min-dom';

export default class ValuesComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const { values } = props;

    this.state = {
      values
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  isValid(value) {
    return value.match(/^\s*"[^"]*"\s*$/);
  }

  onKeyDown(e) {
    const values = e.target.value.split(',').map(value => value.trim());

    if (!values.reduce((areValid, value) => {
      return areValid && this.isValid(value);
    }, true)) {
      return;
    }

    const { onChange } = this.props;

    const newValues = uniq(this.state.values.concat(values));

    if (e.keyCode == 13) {
      this.setState({
        values: newValues
      });

      onChange && onChange(newValues);
    }
  }

  onKeyUp(e) {
    const values = e.target.value.split(',');

    if (e.target.value !== '' && !values.reduce((areValid, value) => {
      return areValid && this.isValid(value);
    }, true)) {
      domClasses(this.node).add('invalid');
    } else {
      domClasses(this.node).remove('invalid');
    }
  }

  // is triggered onMouseup, onClick sometimes triggers click
  // on the value that comes after when value has been deleted
  removeValue(value) {
    const { onChange } = this.props;

    const values = this.state.values.filter(t => t !== value);

    this.setState({
      values
    });

    onChange && onChange(values);
  }

  render() {
    const { values } = this.state;

    return (
      <div className="values">
        {
          values.map(value => {
            return (
              <span
                onMouseup={ () => this.removeValue(value) }
                className="value"
                title="Remove Value">
                { value }
              </span>
            );
          })
        }
        <input
          ref={ node => this.node = node }
          placeholder='"value", "value", ...'
          onKeyDown={ this.onKeyDown }
          onKeyUp={ this.onKeyUp }
          className="input" value="" />
      </div>
    );
  }
}