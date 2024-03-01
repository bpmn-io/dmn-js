import { forEach } from 'min-dash';

const NOT_REGISTERED_ERROR = 'is not a registered action',
      IS_REGISTERED_ERROR = 'is already registered';


/**
 * An interface that provides access to modeling actions by decoupling
 * the one who requests the action to be triggered and the trigger itself.
 *
 * It's possible to add new actions by registering them with ´registerAction´ and likewise
 * unregister existing ones with ´unregisterAction´.
 *
 */
export default class EditorActions {
  constructor(commandStack, eventBus) {

    this._actions = {
      undo() {
        commandStack.undo();
      },
      redo() {
        commandStack.redo();
      }
    };
  }

  /**
   * Triggers a registered action
   *
   * @param  {string} action
   * @param  {Object} opts
   *
   * @return {Unknown} Returns what the registered listener returns
   */
  trigger(action, opts) {
    if (!this._actions[action]) {
      throw error(action, NOT_REGISTERED_ERROR);
    }

    return this._actions[action](opts);
  }

  /**
   * Registers a collections of actions.
   * The key of the object will be the name of the action.
   *
   * @param  {Object} actions
   */
  register(actions, listener) {
    if (typeof actions === 'string') {
      return this._registerAction(actions, listener);
    }

    forEach(actions, (listener, action) => {
      this._registerAction(action, listener);
    }, this);
  }

  /**
   * Registers a listener to an action key
   *
   * @param  {string} action
   * @param  {Function} listener
   */
  _registerAction(action, listener) {
    if (this.isRegistered(action)) {
      throw error(action, IS_REGISTERED_ERROR);
    }

    this._actions[action] = listener;
  }

  /**
   * Unregister an existing action
   *
   * @param {string} action
   */
  unregister(action) {
    if (!this.isRegistered(action)) {
      throw error(action, NOT_REGISTERED_ERROR);
    }

    this._actions[action] = undefined;
  }


  /**
   * Checks wether the given action is registered
   *
   * @param {string} action
   *
   * @return {boolean}
   */
  isRegistered(action) {
    return !!this._actions[action];
  }
}

EditorActions.$inject = [
  'commandStack',
  'eventBus'
];

// helpers /////////////

function error(action, message) {
  return new Error(action + ' ' + message);
}