import { Component } from 'inferno';


export default class SelectComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const { onChange } = this.props;

    if (typeof onChange !== 'function') {
      return;
    }

    const { value } = event.target;

    onChange(value);
  }

  render() {
    const {
      className,
      options,
      value
    } = this.props;

    return (
      <select
        className={ [ className || '', 'dms-select' ].join(' ') }
        onChange={ this.onChange }
        value={ value }>
        {
          (options || []).map(({ label, value }) => {
            return <option className="option" value={ value }>{ label }</option>;
          })
        }
      </select>
    );
  }
}