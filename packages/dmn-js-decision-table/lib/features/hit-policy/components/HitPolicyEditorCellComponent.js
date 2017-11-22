
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class HitPolicyCellComponent extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    // ...
  }

  componentWillMount() {
    this._sheet = this.context.injector.get('sheet');
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy.charAt(0);

    return (
      <th
        id="hit-policy"
        data-element-id={ root.id }
        data-hit-policy="true"
        onClick={ this.onClick }
        className="hit-policy"
        rowspan="3">{ hitPolicy }</th>
    );
  }
}