import { Component } from 'inferno';


export default class Select extends Component {

  constructor(props, context) {
    super(props, context);

    const { value } = props;

    this.state = {
      value
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;

    this.setState({
      value
    });
  }

  onChange = (event) => {
    const { value } = event.target;

    this.setState({
      value
    });

    const { onChange } = this.props;

    if (typeof onChange !== 'function') {
      return;
    }

    onChange(value);
  }

  render() {
    const {
      className,
      options
    } = this.props;

    const { value } = this.state;

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