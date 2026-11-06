import mountInputSelect from 'dmn-js-shared/lib/components/mountInputSelect';

import { getTypeRefOptions } from 'dmn-js-shared/lib/util/TypeRefUtil';

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
   * @param {import('diagram-js/lib/core/Canvas').default} canvas
   */
  constructor(eventBus, overlays, dataTypes, drdFactory, modeling, translate, canvas) {
    this._eventBus = eventBus;
    this._overlays = overlays;
    this._dataTypes = dataTypes;
    this._drdFactory = drdFactory;
    this._modeling = modeling;
    this._translate = translate;

    this._canvas = canvas;

    this._current = null;

    this._eventBus.on('selection.changed', (event) => {

      // clean up any existing overlays
      this.close();

      const selection = event.newSelection;

      const target = selection.length === 1 ? selection[0] : null;

      if (target && is(target, 'dmn:InputData')) {
        this.open(target);
      }
    });

    this._eventBus.on([ 'diagram.clear', 'diagram.destroy' ], () => this.close());

    this._eventBus.on('canvas.viewbox.changed', () => this._update());

    this._eventBus.on('elements.changed', event => {
      if (!this._current) {
        return;
      }

      const { element } = this._current;

      if (event.elements.includes(element)) {
        this._update();
      }
    });
  }

  open(element) {
    this.close();

    const container = document.createElement('div');
    container.className = 'dms-type-ref-dropdown';
    container.addEventListener('mousedown', event => event.stopPropagation());

    const selector = mountInputSelect(container, this._canvas.getContainer());
    this._current = {
      element,
      container,
      selector
    };

    this._update();

    this._overlays.add(element, 'type-ref-dropdown', {
      position: {
        top: 60,
        left: 0
      },
      html: container
    });
  }

  close() {
    if (this._current) {
      this._current.selector.destroy();
    }

    this._current = null;
    this._overlays.remove({ type: 'type-ref-dropdown' });
  }

  _update() {
    if (!this._current) {
      return;
    }

    const { element, selector } = this._current;

    selector.update({
      className: 'dms-type-ref-select',
      label: this._translate('Type'),
      value: this._getTypeRef(element),
      options: getTypeRefOptions(this._dataTypes.getAll()),
      searchable: true,
      emptyLabel: this._translate('No matching types'),
      onChange: typeRef => this._setTypeRef(element, typeRef)
    });
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

    this._modeling.updateModdleProperties(element, variable, { typeRef });
  }
}

TypeRefDropdown.$inject = [
  'eventBus',
  'overlays',
  'dataTypes',
  'drdFactory',
  'modeling',
  'translate',
  'canvas'
];
