import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class ExtractDecisionTableHandler {

  constructor(dmnFactory, moddle, modeling, sheet) {
    this._dmnFactory = dmnFactory;
    this._moddle = moddle;
    this._modeling = modeling;
    this._sheet = sheet;
  }

  /**
   * <do>
   */
  execute(context) {
    const { cols } = context;

    // (1) remove cols from decision table
    // (2) create new decision table
    // (3) add cols to new decision table

    return [];
  }


  /**
   * <undo>
   */
  revert(context) {
    const {
      cols,
      newDecisionTable
    } = context;

    return [];
  }

}

ExtractDecisionTableHandler.$inject = [
  'dmnFactory',
  'moddle',
  'modeling',
  'sheet'
];