import { Row, Col } from 'table-js/lib/model';

import { reviveDescriptor } from '../DescriptorUtil';

/**
 * A handler that implements pasting elements.
 */
export default class PasteHandler {

  constructor(
      clipboard,
      dmnFactory,
      elementFactory,
      elementRegistry,
      eventBus,
      moddle,
      modeling,
      sheet
  ) {
    this._clipboard = clipboard;
    this._dmnFactory = dmnFactory;
    this._elementFactory = elementFactory;
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._model = moddle;
    this._modeling = modeling;
    this._sheet = sheet;
  }


  /**
   * <do>
   */
  postExecute(context) {
    let {
      element,
      after
    } = context;

    const data = this._clipboard.get();

    if (!data) {
      throw new Error('missing clipboard data');
    }

    const root = this._sheet.getRoot();

    // (1) create elements from descriptors
    const elements = reviveDescriptor(data.elements, {
      _dmnFactory: this._dmnFactory,
      _keepIds: data.keepIds,
      _model: this._model
    }).root;

    // (2) add elements to sheet
    if (element instanceof Row) {

      let index = root.rows.indexOf(element);

      if (index === -1) {
        return;
      }

      elements.forEach(element => {
        if (after) {
          index++;
        }

        this._modeling.addRow(element, index);
      });

    } else if (element instanceof Col) {

      let index = root.cols.indexOf(element);

      if (index === -1) {
        return;
      }

      elements.forEach(element => {
        if (after) {
          index++;
        }

        this._modeling.addCol(element, index);
      });

    }

    context.oldElements = this._clipboard.get();

    return this._sheet.getRoot();
  }

  /**
   * <undo>
   */
  revert(context) {

  }

}

PasteHandler.$inject = [
  'clipboard',
  'dmnFactory',
  'elementFactory',
  'elementRegistry',
  'eventBus',
  'moddle',
  'modeling',
  'sheet'
];