import { isArray } from 'min-dash';

import CutHandler from './cmd/CutHandler';
import PasteHandler from './cmd/PasteHandler';

import { createDescriptor } from './DescriptorUtil';


export default class CutPaste {

  constructor(clipboard, commandStack, eventBus, modeling, selection, sheet) {
    this._clipboard = clipboard;
    this._commandStack = commandStack;
    this._eventBus = eventBus;
    this._modeling = modeling;
    this._selection = selection;
    this._sheet = sheet;

    commandStack.registerHandler('cut', CutHandler);
    commandStack.registerHandler('paste', PasteHandler);
  }

  /**
   * Copy elements.
   *
   * @param {Array} elements - Elements to be copied.
   */
  copy(elements) {
    if (!isArray(elements)) {
      elements = [ elements ];
    }

    const data = {
      elements: createDescriptor(elements)
    };

    this._eventBus.fire('copyCutPaste.copy', { data });

    this._clipboard.set(data);
  }

  /**
   * Cut elements thereby removing them temporarily.
   *
   * @param {Array} elements - Elements to be cut.
   */
  cut(elements) {
    if (!isArray(elements)) {
      elements = [ elements ];
    }

    const data = {
      elements: createDescriptor(elements),
      keepIds: true
    };

    const context = {
      elements,
      data
    };

    this._eventBus.fire('copyCutPaste.cut', { data });

    this._commandStack.execute('cut', context);
  }

  /**
   * Paste rows or cols before row or col.
   *
   * @param {Row|Col} element - Row or col to paste elements before.
   */
  pasteBefore(element) {
    const context = {
      element,
      before: true
    };

    this._commandStack.execute('paste', context);

    this._selection.deselect();
  }

  /**
   * Paste rows or cols after row or col.
   *
   * @param {Row|Col} element - Row or col to paste elements after.
   */
  pasteAfter(element) {
    const context = {
      element,
      after: true
    };

    this._commandStack.execute('paste', context);

    this._selection.deselect();
  }

  /**
   * Paste elements at.
   */
  pasteAt(element) {
    // TODO: implement for pasting cells
  }
}

CutPaste.$inject = [
  'clipboard',
  'commandStack',
  'eventBus',
  'modeling',
  'selection',
  'sheet'
];