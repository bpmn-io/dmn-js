
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

const noop = () => {};

export default class SelectComponent extends Component {
  render() {
    const { className, onChange, options, value, ...rest } = this.props;

    const classes = [
      'select-component'
    ];

    if (className) {
      classes.push(className);
    }

    return (
      <select
        className={ classes.join(' ') }
        onChange={ onChange || noop }
        value={ value }
        { ...rest }>
        {
          (options || []).map(({ label, value }) => {
            return <option className="option" value={ value }>{ label }</option>;
          })
        }
      </select>
    );
  }
}