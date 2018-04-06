import {
  getRange
} from 'selection-ranges';

import {
  event as domEvent
} from 'min-dom';

import {
  getFocusableNode,
  getNodeById
} from '../../cell-selection/CellSelectionUtil';

import {
  isCmd,
  isShift
} from '../../keyboard/KeyboardUtil';


/**
 * Keybindings for Copy + Paste
 */
export default class CopyPasteKeyBindings {

  constructor(
      injector, eventBus, clipboard,
      cellSelection, elementRegistry, editorActions,
      renderer) {

    this._clipboard = clipboard;
    this._cellSelection = cellSelection;
    this._elementRegistry = elementRegistry;
    this._editorActions = editorActions;
    this._keyboard = injector.get('keyboard', false);
    this._renderer = renderer;

    if (!this._keyboard) {
      return;
    }

    eventBus.on('keyboard.init', this._registerBindings);

    eventBus.on('keyboard.bind', () => {
      domEvent.bind(document, 'copy', this._clearClipboard, true);
      domEvent.bind(document, 'cut', this._clearClipboard, true);
    });

    eventBus.on('keyboard.unbind', () => {
      domEvent.unbind(document, 'copy', this._clearClipboard, true);
      domEvent.unbind(document, 'cut', this._clearClipboard, true);
    });
  }

  _clearClipboard = () => {
    this._clipboard.clear();
  }

  /**
   * Return the selected cell within the decision table.
   *
   * This verifies that a cell ready for copy-or-paste is
   * actual selected by the user, in the Browser UI.
   *
   * @return {Cell}
   */
  _getSelectedCell() {

    const elementId = this._cellSelection.getCellSelection();

    // we may have no selection
    if (!elementId) {
      return;
    }

    const cell = this._elementRegistry.get(elementId);

    // selection may not be a cell
    if (!cell) {
      return;
    }

    const container = this._renderer.getContainer();

    const node = getNodeById(elementId, container);

    const focusableNode = getFocusableNode(node);

    // focusable element in selection may not be actual
    // browser focus, i.e. when a menu is open
    if (document.activeElement !== focusableNode) {
      return;
    }

    const range = getRange(node);

    // user may attempt native copy-paste operation right now
    // don't interfere with normal text copying
    if (range && (range.start !== range.end)) {
      return;
    }

    return cell;
  }


  _registerBindings = () => {

    // copy
    // CTRL/CMD + C
    const copy = (key, modifiers) => {

      if (isCmd(modifiers) && (key === 67)) {
        const cell = this._getSelectedCell();

        if (!cell) {
          return;
        }

        if (isShift(modifiers)) {
          this._editorActions.trigger('copy', {
            element: cell.col
          });
        } else {
          this._editorActions.trigger('copy', {
            element: cell.row
          });
        }

        return true;
      }
    };

    // cut
    // CTRL/CMD + X
    const cut = (key, modifiers) => {

      if (isCmd(modifiers) && (key === 88)) {

        const cell = this._getSelectedCell();

        if (!cell) {
          return;
        }

        if (isShift(modifiers)) {
          this._editorActions.trigger('cut', {
            element: cell.col
          });
        } else {
          this._editorActions.trigger('cut', {
            element: cell.row
          });
        }

        return true;
      }
    };

    // paste
    // CTRL/CMD + V
    const paste = (key, modifiers) => {

      let pasted;

      if (isCmd(modifiers) && (key === 86)) {

        const cell = this._getSelectedCell();

        if (!cell) {
          return;
        }

        if (isShift(modifiers)) {
          pasted = this._editorActions.trigger('pasteAfter', {
            element: cell.col
          });

          if (pasted) {
            this._cellSelection.selectCell('right');
          }
        } else {
          pasted = this._editorActions.trigger('pasteAfter', {
            element: cell.row
          });

          if (pasted) {
            this._cellSelection.selectCell('below');
          }
        }
      }

      // indicate, whether we could paste
      return typeof pasted !== 'undefined';
    };

    // register listeners
    [ copy, cut, paste ].forEach((l) => {
      this._keyboard.addListener(l);
    });
  }

}


CopyPasteKeyBindings.$inject = [
  'injector',
  'eventBus',
  'clipboard',
  'cellSelection',
  'elementRegistry',
  'editorActions',
  'renderer'
];