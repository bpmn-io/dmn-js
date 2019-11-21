import { Component } from 'inferno';


export default class AddInput extends Component {

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
    this._eventBus.fire('addInput');
  }

  render() {

    const {
      businessObject
    } = this.getRoot();

    const inputs = businessObject.input;

    if (!inputs || !inputs.length) {
      return null;
    }

    const colspan = inputs.length;

    return (
      <th
        className="input-cell inputs-label actionable add-input header"
        onClick={ this.handleClick }
        colspan={ colspan }
      >
        { this._translate('Input') } <span
          className="add-input dmn-icon-plus action-icon"
          title={ this._translate('Add Input') }
        ></span>
      </th>
    );
  }

}