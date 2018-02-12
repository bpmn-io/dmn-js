import { Component } from 'inferno';


export default class OutputLabelComponent extends Component {

  componentWillMount() {
    const { injector } = this.context;

    this._sheet = injector.get('sheet');
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          colspan = businessObject.output.length;

    return (
      <th
        className="output output-label"
        colspan={ colspan }>Output</th>
    );
  }

}