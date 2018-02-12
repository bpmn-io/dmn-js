import { Component } from 'inferno';


export default class InputLabelComponent extends Component {

  componentWillMount() {
    const { injector } = this.context;

    this._sheet = injector.get('sheet');
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          colspan = businessObject.input.length;

    return (
      <th
        className="input input-label"
        colspan={ colspan }>Input</th>
    );
  }

}