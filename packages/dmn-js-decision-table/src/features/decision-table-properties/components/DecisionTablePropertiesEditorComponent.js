import { Component } from 'inferno';

import { validateId } from 'dmn-js-shared/lib/util/IdsUtil';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';

import {
  inject,
  mixin,
  classNames,
  SelectionAware
} from 'table-js/lib/components';


export default class DecisionTablePropertiesComponent extends Component {

  constructor(props, context) {
    super(props, context);

    inject(this);
  }

  componentWillMount() {
    const {
      injector
    } = this.context;

    this.sheet = injector.get('sheet');
    this.modeling = injector.get('modeling');

    this.setupChangeListeners({ bind: this.getBusinessObject().id });
  }

  componentWillUnmount() {
    this.setupChangeListeners({
      unbind: this.getBusinessObject().id
    });
  }

  setupChangeListeners({ bind, unbind }) {

    if (typeof unbind === 'string') {
      this.changeSupport.offElementsChanged(unbind, this.onElementsChanged);
    }

    if (typeof bind === 'string') {
      this.changeSupport.onElementsChanged(bind, this.onElementsChanged);
    }
  }

  getBusinessObject() {
    return this.sheet.getRoot().businessObject.$parent;
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  setDecisionTableName = (name) => {
    this.modeling.editDecisionTableName(name);
  }

  setDecisionTableId = (id) => {

    var bo = this.getBusinessObject();

    var oldId = bo.id;

    if (oldId === id) {
      return;
    }

    // re-bind change listeners from oldId to new id
    this.setupChangeListeners({ bind: id, unbind: oldId });

    this.modeling.editDecisionTableId(id);
  }

  validateId = (id) => {
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
          ctrlForNewline={ true }
          onChange={ this.setDecisionTableName }
          elementId={ '__decisionProperties_name' }
          coords={ '0:__decisionProperties' }
        />
        <DecisionTableId
          className="decision-table-id"
          value={ id }
          ctrlForNewline={ true }
          validate={ this.validateId }
          onChange={ this.setDecisionTableId }
          elementId={ '__decisionProperties_id' }
          coords={ '1:__decisionProperties' }
        />
      </header>
    );
  }
}

DecisionTablePropertiesComponent.$inject = [
  'sheet',
  'modeling',
  'changeSupport'
];


class DecisionTableName extends EditableComponent {

  constructor(props, context) {
    super(props, context);

    mixin(this, SelectionAware);
  }

  render() {

    const className = classNames(
      this.getSelectionClasses(),
      this.getClassName()
    );

    return (
      <h3
        className={ className }
        data-element-id={ this.props.elementId }
        data-coords={ this.props.coords }
        title="Decision Name"
      >
        { this.getEditor() }
      </h3>
    );
  }

}

class DecisionTableId extends EditableComponent {

  constructor(props, context) {
    super(props, context);

    mixin(this, SelectionAware);
  }

  render() {

    const className = classNames(
      this.getSelectionClasses(),
      this.getClassName()
    );

    return (
      <h5
        className={ className }
        title="Decision Id"
        data-element-id={ this.props.elementId }
        data-coords={ this.props.coords }
      >
        { this.getEditor() }
      </h5>
    );
  }

}