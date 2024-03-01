/**
 * A single decision element registry.
 *
 * The sole purpose of this service is to provide the necessary API
 * to serve shared components, i.e. the UpdatePropertiesHandler.
 */
export default class ElementRegistry {

  constructor(viewer, eventBus) {
    this._eventBus = eventBus;
    this._viewer = viewer;
  }

  updateId(element, newId) {

    const rootElement = this._viewer.getRootElement();

    if (element !== rootElement) {
      throw new Error('element !== rootElement');
    }

    this._eventBus.fire('element.updateId', {
      element: element,
      newId: newId
    });

    element.id = newId;
  }

}

ElementRegistry.$inject = [
  'viewer',
  'eventBus'
];