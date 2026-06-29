import {
  getBusinessObject,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * Displays dropdown overlay that can be used to change element type.
 */
export default class TypeRefDropdown {

  /**
   *
   * @param {import('diagram-js/lib/core/EventBus').default} eventBus
   * @param {import('diagram-js/lib/features/overlays/Overlays').default} overlays
   * @param {import('dmn-js-shared/lib/features/data-types/DataTypes').default} dataTypes
   * @param {import('../modeling/DrdFactory').default} drdFactory
   * @param {import('../modeling/Modeling').default} modeling
   * @param {import('diagram-js/lib/i18n/translate/Translate').default} translate
   */
  constructor(eventBus, overlays, dataTypes, drdFactory, modeling, translate) {
    this._eventBus = eventBus;
    this._overlays = overlays;
    this._dataTypes = dataTypes;
    this._drdFactory = drdFactory;
    this._modeling = modeling;
    this._translate = translate;

    this._eventBus.on('selection.changed', (event) => {

      // clean up any existing overlays
      this._currentTarget = null;
      this.close();

      const selection = event.newSelection;

      const target = selection.length
        ? selection.length === 1
          ? selection[0]
          : selection
        : null;

      if (target && is(target, 'dmn:InputData')) {
        this._currentTarget = target;
        this.open(target);
      }
    });
  }

  open(element) {
    this._overlays.add(element, 'type-ref-dropdown', {
      position: {
        top: 60,
        left: 0
      },
      html: this._getOverlayNode(element)
    });
  }

  close() {
    this._overlays.remove({ type: 'type-ref-dropdown' });
  }

  _getOverlayNode(element) {
    const container = document.createElement('div');
    container.className = 'dms-type-ref-dropdown';

    const select = document.createElement('select');
    select.className = 'dms-type-ref-select dms-select';
    select.ariaLabel = this._translate('Type');

    const currentTypeRef = this._getTypeRef(element);
    const dataTypes = this._dataTypes.getAll();
    const types = dataTypes.includes(currentTypeRef)
      ? dataTypes
      : [ currentTypeRef, ...dataTypes ];

    const options = types.map(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = this._translate(type);

      return option;
    });

    options.forEach(option => select.appendChild(option));

    select.value = currentTypeRef;

    container.appendChild(select);

    select.addEventListener('change', (event) => {
      this._setTypeRef(element, event.target.value);
    });

    return container;
  }

  _getCurrentTarget() {
    return this._currentTarget;
  }

  _getTypeRef(element) {
    const bo = getBusinessObject(element);

    return bo.get('variable')?.get('typeRef') || 'Any';
  }

  _setTypeRef(element, typeRef) {
    const bo = getBusinessObject(element);
    const variable = bo.get('variable');

    if (!variable) {
      const newVariable = this._drdFactory.create('dmn:InformationItem', {
        name: bo.get('name'),
        typeRef
      });

      this._modeling.updateProperties(element, {
        variable: newVariable
      });

      return;
    }

    this._modeling.updateProperties(variable, { typeRef });
  }
}

TypeRefDropdown.$inject = [
  'eventBus',
  'overlays',
  'dataTypes',
  'drdFactory',
  'modeling',
  'translate'
];