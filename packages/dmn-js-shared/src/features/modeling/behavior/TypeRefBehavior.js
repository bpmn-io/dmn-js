import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { render } from 'inferno';
import TypeRefDropdown from '../../../components/TypeRefDropdown';
import { getBusinessObject, is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class TypeRefBehavior extends CommandInterceptor {
  static $inject = [ 'eventBus', 'overlays', 'elementRegistry', 'modeling', 'selection', 'dataTypes', 'translate' ];

  constructor(eventBus, overlays, elementRegistry, modeling, selection, dataTypes, translate) {
    super(eventBus);

    this._eventBus = eventBus;
    this._overlays = overlays;
    this._elementRegistry = elementRegistry;
    this._modeling = modeling;
    this._selection = selection;
    this._dataTypes = dataTypes;
    this._translate = translate;

    this._currentOverlay = null;

    this.postExecuted('element.updateProperties', this.updateTypeRefInModel);

    const self = this;

    eventBus.on('element.click', function(e) {
      if (is(e.element, 'dmn:InputData')) {
        self._openOverlay(e.element);
      } else {
        self._closeOverlay();
      }
    });

    eventBus.on('create.end', function(e) {
      if (is(e.shape, 'dmn:InputData')) {
        self._openOverlay(e.shape);
      }
    });
  }

  updateTypeRefInModel = ({ context }) => {
    const { element, properties } = context;

    if (!properties) {
      return;
    }

    if (!('typeRef' in properties)) {
      return;
    }

    if (!is(element, 'dmn:InputData')) {
      return;
    }

    const newTypeRef = properties.typeRef;

    // notify ChangeSupport consumers to re-read model
    const allElements = this._elementRegistry ? this._elementRegistry.getAll() : [];
    this._eventBus.fire('elements.changed', { elements: allElements });

    // keep backward-compatible event
    this._eventBus.fire('typeRef.updated', { element, typeRef: newTypeRef });
  };

  _openOverlay(element) {
    this._closeOverlay();

    const businessObject = getBusinessObject(element);
    const currentType = (businessObject.variable && businessObject.variable.typeRef) || businessObject.typeRef || 'Any';
    const dataTypes = this._dataTypes ? this._dataTypes.getAll() : [];

    const options = (dataTypes || []).map(t => ({ label: this._translate ? this._translate(t) : t, value: t }));

    const container = document.createElement('div');

    this._currentOverlay = this._overlays.add(element, 'type-ref', {
      position: { top: -40, left: 0 },
      html: container
    });

    const onChange = (typeRef) => {
      let actualElement = element;

      if (is(actualElement, 'dmn:LiteralExpression')) {
        actualElement = actualElement.$parent;
      }

      if (actualElement.type === 'dmn:InputData') {
        const variable = getBusinessObject(actualElement).variable;

        if (variable) {
          this._modeling.updateProperties(variable, { typeRef });
        } else {
          this._modeling.updateProperties(actualElement, { typeRef });
        }
      } else {
        this._modeling.updateProperties(actualElement, { inputExpression: { typeRef } });
      }

      const allElements = this._elementRegistry ? this._elementRegistry.getAll() : [];
      this._eventBus.fire('elements.changed', { elements: allElements });
      this._eventBus.fire('typeRef.updated', { element, typeRef });

    };
    render(
      <TypeRefDropdown
        options={ options }
        value={ currentType }
        onChange={ onChange }
        translate={ this._translate }
      />,
      container
    );
  }

  _closeOverlay() {
    if (this._currentOverlay) {
      this._overlays.remove(this._currentOverlay);
      this._currentOverlay = null;
    }
  }
}
