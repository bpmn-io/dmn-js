import { Component } from 'inferno';

export default class TypeRefDropdown extends Component {

  constructor(props, context) {
    super(props, context);

    const { value = '' } = props;

    this.state = { value };
  }

  componentWillReceiveProps(props) {
    const { value = '' } = props;

    this.setState({ value });
  }

  onChange = (event) => {
    const { value } = event.target;

    this.setState({ value });

    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  render() {
    const { className, label, options = [] } = this.props;
    const { value } = this.state;

    return (
      <div className={ [ className || '', 'dms-type-ref-dropdown' ].join(' ') }>
        <select
          aria-label={ label || 'Type' }
          className={ 'dms-type-ref-select dms-select' }
          onChange={ this.onChange }
          value={ value }>
          {
            (options || []).map(opt => {
              if (typeof opt === 'string') {
                return <option key={ opt } value={ opt }>{ opt }</option>;
              }

              const { label: optLabel, value: optValue } = opt;
              return <option key={ optValue } value={ optValue }>{ optLabel }</option>;
            })
          }
        </select>
      </div>
    );
  }
}