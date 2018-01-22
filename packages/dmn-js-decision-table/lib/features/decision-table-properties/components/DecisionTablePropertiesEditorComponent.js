
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { validateId } from '../../../util/IdsUtil';

import EditableComponent from '../../../components/EditableComponent';


export default class DecisionTablePropertiesComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.setDecisionTableName = this.setDecisionTableName.bind(this);
    this.setDecisionTableId = this.setDecisionTableId.bind(this);

    this.validateId = this.validateId.bind(this);

    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  componentWillMount() {
    const {
      injector
    } = this.context;

    this._sheet = injector.get('sheet');
    this._modeling = injector.get('modeling');

    this.setupChangeListeners({ bind: this.getBusinessObject().id });
  }

  componentWillUnmount() {
    this.setupChangeListeners({
      unbind: this.getBusinessObject().id
    });
  }

  setupChangeListeners({ bind, unbind }) {

    const {
      changeSupport
    } = this.context;

    if (typeof unbind === 'string') {
      changeSupport.offElementsChanged(unbind, this.onElementsChanged);
    }

    if (typeof bind === 'string') {
      changeSupport.onElementsChanged(bind, this.onElementsChanged);
    }
  }

  getBusinessObject() {
    return this._sheet.getRoot().businessObject.$parent;
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  setDecisionTableName(name) {
    this._modeling.editDecisionTableName(name);
  }

  setDecisionTableId(id) {

    var bo = this.getBusinessObject();

    var oldId = bo.id;

    if (oldId === id) {
      return;
    }

    // re-bind change listeners from oldId to new id
    this.setupChangeListeners({ bind: id, unbind: oldId });

    this._modeling.editDecisionTableId(id);
  }

  validateId(id) {
    var bo = this.getBusinessObject();
    return validateId(bo, id);
  }

  render() {
    const bo = this.getBusinessObject();

    const { id, name } = bo;

    return (
      <header className="decision-table-properties">
        <DecisionTableName
          className="decision-table-name"
          value={ name }
          onChange={ this.setDecisionTableName } />
        <DecisionTableId
          className="decision-table-id"
          value={ id }
          validate={ this.validateId }
          onChange={ this.setDecisionTableId } />
      </header>
    );
  }
}


class DecisionTableName extends EditableComponent {

  render() {

    return (
      <h3 className={ this.getClassName() }>
        { this.getEditor() }
      </h3>
    );
  }

}

class DecisionTableId extends EditableComponent {

  render() {

    return (
      <h5 className={ this.getClassName() }>
        { this.getEditor() }
      </h5>
    );
  }

}