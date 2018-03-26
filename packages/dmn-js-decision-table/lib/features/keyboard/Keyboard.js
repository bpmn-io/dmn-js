import {
  getRange
} from 'selection-ranges';

import { event as domEvent } from 'min-dom';

import {
  findSelectableAncestor
} from '../cell-selection/CellSelectionUtil';

import {
  isCmd,
  isShift
} from './KeyboardUtil';

import {
  query as domQuery
} from 'min-dom';

/**
 * A keyboard abstraction that may be activated and
 * deactivated by users at will, consuming key events
 * and triggering diagram actions.
 *
 * The implementation fires the following key events that allow
 * other components to hook into key handling:
 *
 *  - keyboard.bind
 *  - keyboard.unbind
 *  - keyboard.init
 *  - keyboard.destroy
 *
 * All events contain the fields (node, listeners).
 *
 * A default binding for the keyboard may be specified via the
 * `keyboard.bindTo` configuration option.
 *
 * @param {Config} config
 * @param {EventBus} eventBus
 * @param {EditorActions} editorActions
 */
export default class Keyboard {

  constructor(cellSelection, config, editorActions, elementRegistry, eventBus, renderer) {

    this._cellSelection = cellSelection;
    this._config = config || {};
    this._editorActions = editorActions;
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._renderer = renderer;

    this._listeners = [];

    eventBus.on('table.destroy', this._destroy);
    eventBus.on('table.init', this._init);

    eventBus.on('attach', () => {

      if (this._config.bindTo) {
        this.bind(config.bindTo);
      }
    });

    eventBus.on('detach', this.unbind);
  }

  _init = () => {
    this._registerDefaultBindings();

    this._fire('init');
  }

  _destroy = () => {
    this._fire('destroy');

    this.unbind();
    this._listeners = null;
  }

  // our key handler is a singleton that passes
  // (keycode, modifiers) to each listener.
  //
  // listeners must indicate that they handled a key event
  // by returning true. This stops the event propagation.
  //
  _keyHandler = (event) => {

    var i, l,
        listeners = this._listeners,
        code = event.keyCode || event.charCode || -1;

    for (i = 0; (l = listeners[i]); i++) {
      if (l(code, event)) {
        event.preventDefault();
        event.stopPropagation();

        return;
      }
    }
  }

  bind(node) {
    // make sure that the keyboard is only bound once to the DOM
    this.unbind();

    this._node = node;

    // bind key events
    domEvent.bind(node, 'keydown', this._keyHandler, true);

    this._fire('bind');
  }

  getBinding() {
    return this._node;
  }

  unbind = () => {
    var node = this._node;

    if (node) {
      this._fire('unbind');

      // unbind key events
      domEvent.unbind(node, 'keydown', this._keyHandler, true);
    }

    this._node = null;
  }

  _fire(event) {
    this._eventBus.fire('keyboard.' + event, {
      node: this._node,
      listeners: this._listeners
    });
  }

  _registerDefaultBindings() {

    var listeners = this._listeners;

    var editorActions = this._editorActions;

    // init default listeners

    // undo
    // (CTRL|CMD) + Z
    function undo(key, modifiers) {

      if (isCmd(modifiers) && !isShift(modifiers) && key === 90) {
        editorActions.trigger('undo');

        return true;
      }
    }

    // redo
    // CTRL + Y
    // CMD + SHIFT + Z
    function redo(key, modifiers) {

      if (
        isCmd(modifiers) && (
          key === 89 || (
            key === 90 && isShift(modifiers)
          )
        )
      ) {
        editorActions.trigger('redo');

        return true;
      }
    }

    listeners.push(undo);
    listeners.push(redo);


    function selectCell(key, event) {

      if (key !== 13 || isCmd(event)) {
        return;
      }

      if (!findSelectableAncestor(event.target)) {
        return;
      }

      const cmd = isShift(event) ? 'selectCellAbove' : 'selectCellBelow';

      editorActions.trigger(cmd);

      return true;
    }

    listeners.push(selectCell);

    // copy
    // CTRL/CMD + C
    const copy = (key, modifiers) => {
      const cellSelectedId = this._cellSelection.getCellSelected();

      const container = this._renderer.getContainer();

      const cellSelected = domQuery(`[data-element-id="${ cellSelectedId }"]`, container);

      const cell = this._elementRegistry.get(cellSelectedId);

      if (!cellSelected || !cell) {
        return;
      }

      const range = getRange(cellSelected);

      if (range
        && (range.start !== range.end)) {

        // don't interfere with normal text copying
        return;
      }

      if (isCmd(modifiers) && (key === 67)) {
        if (isShift(modifiers)) {
          editorActions.trigger('copy', {
            element: cell.col
          });
        } else {
          editorActions.trigger('copy', {
            element: cell.row
          });
        }

        return true;
      }
    };

    // cut
    // CTRL/CMD + X
    const cut = (key, modifiers) => {
      const cellSelectedId = this._cellSelection.getCellSelected();

      const container = this._renderer.getContainer();

      const cellSelected = domQuery(`[data-element-id="${ cellSelectedId }"]`, container);

      const cell = this._elementRegistry.get(cellSelectedId);

      if (!cellSelected || !cell) {
        return;
      }

      const range = getRange(cellSelected);

      if (range
        && (range.start !== range.end)) {

        // don't interfere with normal text copying
        return;
      }

      if (isCmd(modifiers) && (key === 88)) {
        if (isShift(modifiers)) {
          editorActions.trigger('cut', {
            element: cell.col
          });
        } else {
          editorActions.trigger('cut', {
            element: cell.row
          });
        }

        return true;
      }
    };

    // paste
    // CTRL/CMD + V
    const paste = (key, modifiers) => {
      const cellSelectedId = this._cellSelection.getCellSelected();

      const container = this._renderer.getContainer();

      const cellSelected = domQuery(`[data-element-id="${ cellSelectedId }"]`, container);

      const cell = this._elementRegistry.get(cellSelectedId);

      if (!cellSelected || !cell) {
        return;
      }

      const range = getRange(cellSelected);

      if (range
        && (range.start !== range.end)) {

        // don't interfere with normal text copying
        return;
      }

      if (isCmd(modifiers) && (key === 86)) {
        if (isShift(modifiers)) {
          editorActions.trigger('pasteAfter', {
            element: cell.col
          });
        } else {
          editorActions.trigger('pasteAfter', {
            element: cell.row
          });
        }

        return true;
      }
    };

    listeners.push(copy);
    listeners.push(cut);
    listeners.push(paste);
  }


  /**
   * Add a listener function that is notified with (key, modifiers) whenever
   * the keyboard is bound and the user presses a key.
   *
   * @param {Function} listenerFn
   */
  addListener(listenerFn) {
    this._listeners.unshift(listenerFn);
  }

  removeListener(listenerFn) {
    this._listeners = this._listeners.filter(l => l !== listenerFn);
  }

}

Keyboard.$inject = [
  'cellSelection',
  'config.keyboard',
  'editorActions',
  'elementRegistry',
  'eventBus',
  'renderer'
];