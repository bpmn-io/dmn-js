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

  getDecision() {
    return this._viewer.getDecision();
  }

  updateId(element, newId) {

    var decision = this.getDecision();

    if (element !== decision) {
      throw new Error('element !== decision');
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