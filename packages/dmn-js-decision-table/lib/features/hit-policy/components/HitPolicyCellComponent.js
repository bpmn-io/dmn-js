
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class HitPolicyCellComponent extends Component {
  componentWillMount() {
    const { injector } = this.context;
    
    this._sheet = injector.get('sheet');
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy.charAt(0);

    return <th className="hit-policy" rowspan="3">{ hitPolicy }</th>;
  }
}