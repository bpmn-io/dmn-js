import { Component } from 'inferno';

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
  };

  setDecisionTableName = (name) => {
    this.modeling.editDecisionTableName(name);
  };

  render() {
    const bo = this.getBusinessObject();

    const { name } = bo;

    const HitPolicy = this.components.getComponent('hit-policy') || NullComponent;

    return (
      <div className="decision-table-properties">
        <DecisionTableName
          label={ this.translate('Decision name') }
          className="decision-table-name"
          value={ name }
          ctrlForNewline={ true }
          onBlur={ resetScroll }
          onChange={ this.setDecisionTableName }
          elementId={ '__decisionProperties_name' }
          coords={ '0:__decisionProperties' }
        />
        <div className="decision-table-header-separator" />
        <HitPolicy />
      </div>
    );
  }
}

DecisionTablePropertiesComponent.$inject = [
  'sheet',
  'modeling',
  'changeSupport',
  'components',
  'translate'
];


class DecisionTableName extends EditableComponent {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');

    mixin(this, SelectionAware);
  }

  render() {

    const name = this.props.value;

    const className = classNames(
      this.getSelectionClasses(),
      this.getClassName()
    );

    return (
      <div
        className={ className }
        data-element-id={ this.props.elementId }
        data-coords={ this.props.coords }
        title={ this._translate('Decision name: ') + name }
      >
        { this.getEditor() }
      </div>
    );
  }

}

function NullComponent() {
  return null;
}

function resetScroll(event) {
  event.target.scroll(0, 0);
}
