import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


export default class DecisionTablePropertiesComponent extends Component {

  componentWillMount() {
    const { injector } = this.context;

    this._sheet = injector.get('sheet');
  }

  render() {
    const root = this._sheet.getRoot();

    if (!is(root, 'dmn:DMNElement')) {
      return null;
    }

    const { id, name } = root.businessObject.$parent;

    return (
      <header className="decision-table-properties">
        <h3 className="decision-table-name" title="Decision Name">{ name }</h3>
        <h5 className="decision-table-id" title="Decision Id">{ id }</h5>
      </header>
    );
  }
}