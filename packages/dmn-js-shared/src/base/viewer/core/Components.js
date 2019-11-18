import {
  isFunction,
  isNumber
} from 'min-dash';

const DEFAULT_PRIORITY = 1000;


export default class Components {

  constructor() {
    this._listeners = {};
  }

  getComponent(type, context) {
    const listeners = this._listeners[type];

    if (!listeners) {
      return;
    }

    let component;

    for (let i = 0; i < listeners.length; i++) {
      component = listeners[i].callback(context);

      if (component) {
        break;
      }
    }

    return component;
  }

  getComponents(type, context) {
    const listeners = this._listeners[type];

    if (!listeners) {
      return;
    }

    const components = [];

    for (let i = 0; i < listeners.length; i++) {
      const component = listeners[i].callback(context);

      if (component) {
        components.push(component);
      }
    }

    if (!components.length) {
      return;
    }

    return components;
  }

  onGetComponent(type, priority, callback) {
    if (isFunction(priority)) {
      callback = priority;
      priority = DEFAULT_PRIORITY;
    }

    if (!isNumber(priority)) {
      throw new Error('priority must be a number');
    }

    const listeners = this._getListeners(type);

    let existingListener,
        idx;

    const newListener = { priority, callback };

    for (idx = 0; (existingListener = listeners[idx]); idx++) {
      if (existingListener.priority < priority) {

        // prepend newListener at before existingListener
        listeners.splice(idx, 0, newListener);
        return;
      }
    }

    listeners.push(newListener);
  }

  offGetComponent(type, callback) {
    const listeners = this._getListeners(type);

    let listener,
        listenerCallback,
        idx;

    if (callback) {

      // move through listeners from back to front
      // and remove matching listeners
      for (idx = listeners.length - 1; (listener = listeners[idx]); idx--) {
        listenerCallback = listener.callback;

        if (listenerCallback === callback) {
          listeners.splice(idx, 1);
        }
      }
    } else {

      // clear listeners
      listeners.length = 0;
    }
  }

  _getListeners(type) {
    let listeners = this._listeners[type];

    if (!listeners) {
      this._listeners[type] = listeners = [];
    }

    return listeners;
  }
}