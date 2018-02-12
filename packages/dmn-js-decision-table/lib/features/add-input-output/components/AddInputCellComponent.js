import { Component } from 'inferno';

export default class AddInputCellComponent extends Component {
  constructor(props) {
    super(props);

    this.onElementsChanged = this.onElementsChanged.bind(this);
    this.add = this.add.bind(this);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    const changeSupport = this._changeSupport = this.context.changeSupport;
    this._sheet = injector.get('sheet');
    this._eventBus = injector.get('eventBus');

    const root = this._sheet.getRoot();

    changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  componentWillUnmout() {
    const root = this._sheet.getRoot();

    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  add() {
    this._eventBus.fire('addInput');
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          colspan = businessObject.input.length;

    return (
      <th
        onClick={ this.add }
        className="input add-input header actionable"
        colspan={ colspan }>
        Input <span className="dmn-icon-plus action-icon"></span>
      </th>
    );
  }
}