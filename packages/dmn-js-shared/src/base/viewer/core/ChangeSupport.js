export default class ChangeSupport {
  constructor(eventBus) {
    this._listeners = {};

    eventBus.on('elements.changed', ({ elements }) => {
      this.elementsChanged(elements);
    });

    eventBus.on('element.updateId', ({ element, newId }) => {
      this.updateId(element.id, newId);
    });
  }

  elementsChanged(elements) {
    const invoked = {};

    const elementsLength = elements.length;

    for (let i = 0; i < elementsLength; i++) {
      const { id } = elements[i];

      if (invoked[id]) {
        return;
      }

      invoked[id] = true;

      const listenersLength = this._listeners[id] && this._listeners[id].length;

      if (listenersLength) {
        for (let j = 0; j < listenersLength; j++) {

          // listeners might remove themselves before they get called
          this._listeners[id][j] && this._listeners[id][j]();
        }
      }
    }
  }

  onElementsChanged(id, listener) {
    if (!this._listeners[id]) {
      this._listeners[id] = [];
    }

    // avoid push for better performance
    this._listeners[id][this._listeners[id].length] = listener;
  }

  offElementsChanged(id, listener) {
    if (!this._listeners[id]) {
      return;
    }

    if (listener) {
      const idx = this._listeners[id].indexOf(listener);

      if (idx !== -1) {
        this._listeners[id].splice(idx, 1);
      }
    } else {
      this._listeners[id].length = 0;
    }
  }

  updateId(oldId, newId) {
    if (this._listeners[oldId]) {

      this._listeners[newId] = this._listeners[oldId];

      delete this._listeners[oldId];

    }
  }
}

ChangeSupport.$inject = [ 'eventBus' ];