import { Component } from 'inferno';

import { validateId } from 'dmn-js-shared/lib/util/IdsUtil';

import EditableComponent from 'dmn-js-shared/lib/components/EditableComponent';


export default class DecisionPropertiesEditorComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this._viewer = context.injector.get('viewer');
    this._modeling = context.injector.get('modeling');

    this.setupChangeListeners({
      bind: this.getDecision().id
    });
  }

  componentWillUnmount() {
    this.setupChangeListeners({
      unbind: this.getDecision().id
    });
  }

  getDecision() {
    return this._viewer.getDecision();
  }

  onElementsChanged = () => {
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

  setDecisionName = (name) => {
    this._modeling.editDecisionName(name);
  }

  setDecisionId = (id) => {
    const oldId = this.getDecision().id;

    if (oldId === id) {
      return;
    }

    this._modeling.editDecisionId(id);
  }

  validateId = (id) => {
    return validateId(this.getDecision(), id);
  }

  render() {
    const { name, id } = this.getDecision();

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