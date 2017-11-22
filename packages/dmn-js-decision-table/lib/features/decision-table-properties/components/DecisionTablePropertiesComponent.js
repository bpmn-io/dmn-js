
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class DecisionTablePropertiesComponent extends Component {
  
  componentWillMount() {
    const { injector } = this.context;

    this._sheet = injector.get('sheet');
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject;

    const { id, name } = businessObject.$parent;

    return (
      <header className="decision-table-properties">
        <h3 className="decision-table-name">{ name }</h3>
        <h5 className="decision-table-id">{ id }</h5>
      </header>
    );
  }
}