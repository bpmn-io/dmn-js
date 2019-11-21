import { Component } from 'inferno';


export default class AddOutput extends Component {

  constructor(props, context) {
    super(props, context);

    this._sheet = context.injector.get('sheet');
    this._eventBus = context.injector.get('eventBus');

    this._changeSupport = context.changeSupport;
    this._translate = context.injector.get('translate');
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  componentWillMount() {
    const root = this.getRoot();

    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this.getRoot();

    this._changeSupport.offElementsChanged(root.id, this.onElementsChanged);
  }

  getRoot() {
    return this._sheet.getRoot();
  }

  handleClick = (e) => {
    e.stopPropagation();

    this.add();
  }

  add = () => {
    this._eventBus.fire('addOutput');
  }

  render() {

    const {
      businessObject
    } = this.getRoot();

    const colspan = businessObject.output.length;

    return (
      <th
        className="output-cell outputs-label add-output actionable header"
        onClick={ this.handleClick }
        colspan={ colspan }
      >
        { this._translate('Output') } <span
          className="add-output dmn-icon-plus action-icon"
          title={ this._translate('Add Output') }
        ></span>
      </th>
    );
  }

}