/* eslint-disable max-len */

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class ContextMenu {
  constructor(
      components,
      contextMenu,
      clipBoard,
      editorActions,
      eventBus,
      elementRegistry,
      modeling,
      sheet) {

    this._contextMenu = contextMenu;
    this._clipBoard = clipBoard;
    this._editorActions = editorActions;
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._modeling = modeling;
    this._sheet = sheet;

    this._getEntries = this._getEntries.bind(this);

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'context-menu') {
        const entries = this._getEntries(context);

        const additionalEntries = components.getComponents('context-menu-additional', context);

        return () => (
          <div className="context-menu-context-menu">
            { (entries || []).concat(additionalEntries || []) }
          </div>
        );
      }
    });

    eventBus.on('cell.contextmenu', ({ event, id, node }) => {
      event.preventDefault();

      contextMenu.open({
        x: event.pageX,
        y: event.pageY
      }, {
        contextMenuType: 'context-menu',
        id
      });
    });
  }

  _getEntries(context) {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject;

    const handlers = {
      addRuleAbove: (rule) => {
        this._editorActions.trigger('addRuleAbove', { rule });

        this._contextMenu.close();
      },
      addRuleBelow: (rule) => {
        this._editorActions.trigger('addRuleBelow', { rule });

        this._contextMenu.close();
      },
      removeRule: (rule) => {
        this._editorActions.trigger('removeRule', { rule });

        this._contextMenu.close();
      },
      addInputLeft: (input) => {
        this._editorActions.trigger('addInputLeft', { input });

        this._contextMenu.close();
      },
      addInputRight: (input) => {
        this._editorActions.trigger('addInputRight', { input });

        this._contextMenu.close();
      },
      removeInput: (input) => {
        this._editorActions.trigger('removeInput', { input });

        this._contextMenu.close();
      },
      addOutputLeft: (output) => {
        this._editorActions.trigger('addOutputLeft', { output });

        this._contextMenu.close();
      },
      addOutputRight: (output) => {
        this._editorActions.trigger('addOutputRight', { output });

        this._contextMenu.close();
      },
      removeOutput: (output) => {
        this._editorActions.trigger('removeOutput', { output });

        this._contextMenu.close();
      },
      cut: element => {
        this._editorActions.trigger('cut', { element });
      },
      pasteBefore: element => {
        this._editorActions.trigger('pasteBefore', { element });
      },
      pasteAfter: element => {
        this._editorActions.trigger('pasteAfter', { element });
      }
    };

    const id = context && context.id;

    if (!id) {
      return null;
    }

    const element = this._elementRegistry.get(id);

    if (!element) {
      return null;
    }

    const entries = [];

    if (is(element.row, 'dmn:DecisionRule')) {
      const canDelete = businessObject.rule.length > 1;
      const canPaste =
        this._clipBoard.hasElement()
        && is(this._clipBoard.getElement(), 'dmn:DecisionRule');

      entries.push(
        <div className="context-menu-group context-menu-group-rule">
          <h4 className="context-menu-group-title">Rule</h4>
          <div
            className="context-menu-group-entry context-menu-entry-add-rule-above"
            onClick={ () => handlers.addRuleAbove(element.row) }>
            <span className="context-menu-group-entry-icon dmn-icon-up"></span>
            Add Above
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-rule-below"
            onClick={ () => handlers.addRuleBelow(element.row) }>
            <span className="context-menu-group-entry-icon dmn-icon-down"></span>
            Add Below
          </div>
          <div
            className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' } context-menu-entry-remove-rule` }
            onClick={ () => handlers.removeRule(element.row) }>
            <span className="context-menu-group-entry-icon dmn-icon-clear"></span>
            Remove
          </div>
          <div
            className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' } context-menu-entry-cut-rule` }
            onClick={ () => handlers.cut(element.row) }>
            <span className="context-menu-group-entry-icon dmn-icon-cut"></span>
            Cut
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-rule-above` }
            onClick={ () => handlers.pasteBefore(element.row) }>
            <span className="context-menu-group-entry-icon dmn-icon-paste"></span>
            Paste Above
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-rule-below` }
            onClick={ () => handlers.pasteAfter(element.row) }>
            <span className="context-menu-group-entry-icon dmn-icon-paste"></span>
            Paste Below
          </div>
        </div>
      );
    }

    if (is(element, 'dmn:InputClause') || is(element.col, 'dmn:InputClause')) {
      const actualElement = is(element, 'dmn:InputClause') ? element : element.col;

      const canDelete = businessObject.input.length > 1;
      const canPaste =
        this._clipBoard.hasElement()
        && is(this._clipBoard.getElement(), 'dmn:InputClause');

      entries.push(
        <div className="context-menu-group context-menu-group-input">
          <h4 className="context-menu-group-title">Input</h4>
          <div
            className="context-menu-group-entry context-menu-entry-add-input-left"
            onClick={ () => handlers.addInputLeft(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-left"></span>
            Add Left
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-input-right"
            onClick={ () => handlers.addInputRight(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-right"></span>
            Add Right
          </div>
          <div
            className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' } context-menu-entry-remove-input` }
            onClick={ () => handlers.removeInput(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-clear"></span>
            Remove
          </div>
          <div
            className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' } context-menu-entry-cut-input` }
            onClick={ () => handlers.cut(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-cut"></span>
            Cut
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-input-left` }
            onClick={ () => handlers.pasteBefore(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-paste"></span>
            Paste Left
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-input-right` }
            onClick={ () => handlers.pasteAfter(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-paste"></span>
            Paste Right
          </div>
        </div>
      );
    } else if (is(element, 'dmn:OutputClause') || is(element.col, 'dmn:OutputClause')) {
      const actualElement = is(element, 'dmn:OutputClause') ? element : element.col;

      const canDelete = businessObject.output.length > 1;
      const canPaste =
        this._clipBoard.hasElement()
        && is(this._clipBoard.getElement(), 'dmn:OutputClause');

      entries.push(
        <div className="context-menu-group context-menu-group-output">
          <h4 className="context-menu-group-title">Output</h4>
          <div
            className="context-menu-group-entry context-menu-entry-add-output-left"
            onClick={ () => handlers.addOutputLeft(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-left"></span>
            Add Left
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-output-right"
            onClick={ () => handlers.addOutputRight(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-right"></span>
            Add Right
          </div>
          <div
            className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' } context-menu-entry-remove-output` }
            onClick={ () => handlers.removeOutput(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-clear"></span>
            Remove
          </div>
          <div
            className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' } context-menu-entry-cut-output` }
            onClick={ () => handlers.cut(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-cut"></span>
            Cut
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-output-left` }
            onClick={ () => handlers.pasteBefore(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-paste"></span>
            Paste Left
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-output-right` }
            onClick={ () => handlers.pasteAfter(actualElement) }>
            <span className="context-menu-group-entry-icon dmn-icon-paste"></span>
            Paste Right
          </div>
        </div>
      );
    }

    return entries;
  }
}

ContextMenu.$inject = [
  'components',
  'contextMenu',
  'clipBoard',
  'editorActions',
  'eventBus',
  'elementRegistry',
  'modeling',
  'sheet'
];