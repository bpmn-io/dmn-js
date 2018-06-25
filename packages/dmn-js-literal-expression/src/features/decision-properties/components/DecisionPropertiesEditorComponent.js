import { Component } from 'inferno';

import { validateId } from 'dmn-js-shared/lib/util/IdsUtil';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';


export default class DecisionPropertiesEditorComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const viewer = this._viewer = context.injector.get('viewer');
    this._modeling = context.injector.get('modeling');

    this.setDecisionName = this.setDecisionName.bind(this);
    this.setDecisionId = this.setDecisionId.bind(this);
    this.onElementsChanged = this.onElementsChanged.bind(this);
    this.validateId = this.validateId.bind(this);

    const { id } = viewer._decision;

    this.setupChangeListeners({ bind: id });
  }

  componentWillUnmount() {
    const { id } = this._viewer._decision;

    this.setupChangeListeners({
      unbind: id
    });
  }

  onElementsChanged() {
    this.forceUpdate();
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

  setDecisionName(name) {
    this._modeling.editDecisionName(name);
  }

  setDecisionId(id) {
    const oldId = this._viewer._decision.id;

    if (oldId === id) {
      return;
    }

    // re-bind change listeners from oldId to new id
    this.setupChangeListeners({ bind: id, unbind: oldId });

    this._modeling.editDecisionId(id);
  }

  validateId(id) {
    return validateId(this._viewer._decision, id);
  }

  render() {
    const { name, id } = this._viewer._decision;

    return (
      <header className="decision-properties">
        <DecisionName
          className="decision-name editor"
          value={ name }
          onChange={ this.setDecisionName } />
        <DecisionId
          className="decision-id editor"
          value={ id }
          validate={ this.validateId }
          onChange={ this.setDecisionId } />
      </header>
    );
  }
}

class DecisionName extends EditableComponent {

  render() {

    return (
      <h3 className={ this.getClassName() }>
        { this.getEditor() }
      </h3>
    );
  }

}

class DecisionId extends EditableComponent {

  render() {

    return (
      <h5 className={ this.getClassName() }>
        { this.getEditor() }
      </h5>
    );
  }

}