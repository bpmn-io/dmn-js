/* eslint-disable max-len */

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { Cell } from 'table-js/lib/model';

export default class ContextMenu {
  constructor(
      components,
      contextMenu,
      clipboard,
      editorActions,
      eventBus,
      elementRegistry,
      modeling,
      sheet,
      rules,
      translate) {

    this._contextMenu = contextMenu;
    this._clipboard = clipboard;
    this._editorActions = editorActions;
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._modeling = modeling;
    this._sheet = sheet;
    this._rules = rules;
    this._translate = translate;

    this._getEntries = this._getEntries.bind(this);

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'context-menu') {
        const entries = this._getEntries(context);

        const element = this._elementRegistry.get(context.id);

        const additionalCellEntries = isCell(element)
          && components.getComponents('context-menu-cell-additional', context);

        if (additionalCellEntries && additionalCellEntries.length) {
          const cellEntriesGroup = (
            <div className="context-menu-group context-menu-group-cell">
              { additionalCellEntries }
            </div>
          );

          return () => (
            <div className="context-menu-flex">
              { [ cellEntriesGroup ].concat(entries || []) }
            </div>
          );
        } else {
          return () => (
            <div className="context-menu-flex">
              { entries || [] }
            </div>
          );
        }
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
      copy: element => {
        this._editorActions.trigger('copy', { element });

        this._contextMenu.close();
      },
      cut: element => {
        this._editorActions.trigger('cut', { element });

        this._contextMenu.close();
      },
      pasteBefore: element => {
        this._editorActions.trigger('pasteBefore', { element });

        this._contextMenu.close();
      },
      pasteAfter: element => {
        this._editorActions.trigger('pasteAfter', { element });

        this._contextMenu.close();
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

    const clipboardData = this._clipboard.get() || {};

    const entries = [];

    if (is(element.row, 'dmn:DecisionRule')) {
      const canPaste = this._rules.allowed('paste', {
        data: clipboardData.elements,
        target: element.row
      });

      entries.push(
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-copy-rule"
            onClick={ () => handlers.copy(element.row) }>
            { this._translate('Copy Rule') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-cut-rule"
            onClick={ () => handlers.cut(element.row) }>
            { this._translate('Cut Rule') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-rule-above` }
            onClick={ () => handlers.pasteBefore(element.row) }>
            { this._translate('Paste Rule Above') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-rule-below` }
            onClick={ () => handlers.pasteAfter(element.row) }>
            { this._translate('Paste Rule Below') }
          </div>
        </div>,
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-add-rule-above"
            onClick={ () => handlers.addRuleAbove(element.row) }>
            { this._translate('Add Rule Above') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-rule-below"
            onClick={ () => handlers.addRuleBelow(element.row) }>
            { this._translate('Add Rule Below') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-remove-rule"
            onClick={ () => handlers.removeRule(element.row) }>
            { this._translate('Remove Rule') }
          </div>
        </div>
      );
    } else if (is(element, 'dmn:InputClause') || is(element.col, 'dmn:InputClause')) {
      const actualElement = is(element, 'dmn:InputClause') ? element : element.col;

      const canRemove = this._rules.allowed('col.remove', {
        col: element.col || element
      });

      const canPaste = this._rules.allowed('paste', {
        data: clipboardData.elements,
        target: element.col || element
      });

      entries.push(
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-copy-input"
            onClick={ () => handlers.copy(actualElement) }>
            { this._translate('Copy Input Column') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canRemove ? '' : 'disabled' } context-menu-entry-cut-input` }
            onClick={ () => handlers.cut(actualElement) }>
            { this._translate('Cut Input Column') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-input-left` }
            onClick={ () => handlers.pasteBefore(actualElement) }>
            { this._translate('Paste Input Column Left') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-input-right` }
            onClick={ () => handlers.pasteAfter(actualElement) }>
            { this._translate('Paste Input Column Right') }
          </div>
        </div>,
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-add-input-left"
            onClick={ () => handlers.addInputLeft(actualElement) }>
            { this._translate('Add Input Column Left') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-input-right"
            onClick={ () => handlers.addInputRight(actualElement) }>
            { this._translate('Add Input Column Right') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canRemove ? '' : 'disabled' } context-menu-entry-remove-input` }
            onClick={ () => handlers.removeInput(actualElement) }>
            { this._translate('Remove Input Column') }
          </div>
        </div>
      );
    } else if (is(element, 'dmn:OutputClause') || is(element.col, 'dmn:OutputClause')) {
      const actualElement = is(element, 'dmn:OutputClause') ? element : element.col;

      const canRemove = this._rules.allowed('col.remove', {
        col: element.col || element
      });

      const canPaste = this._rules.allowed('paste', {
        data: clipboardData.elements,
        target: element.col || element
      });

      entries.push(
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-copy-output"
            onClick={ () => handlers.copy(actualElement) }>
            { this._translate('Copy Output Column') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canRemove ? '' : 'disabled' } context-menu-entry-cut-output` }
            onClick={ () => handlers.cut(actualElement) }>
            { this._translate('Cut Output Column') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-output-left` }
            onClick={ () => handlers.pasteBefore(actualElement) }>
            { this._translate('Paste Output Column Left') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-output-right` }
            onClick={ () => handlers.pasteAfter(actualElement) }>
            { this._translate('Paste Output Column Right') }
          </div>
        </div>,
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-add-output-left"
            onClick={ () => handlers.addOutputLeft(actualElement) }>
            { this._translate('Add Output Column Left') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-output-right"
            onClick={ () => handlers.addOutputRight(actualElement) }>
            { this._translate('Add Output Column Right') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canRemove ? '' : 'disabled' } context-menu-entry-remove-output` }
            onClick={ () => handlers.removeOutput(actualElement) }>
            { this._translate('Remove Output Column') }
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
  'clipboard',
  'editorActions',
  'eventBus',
  'elementRegistry',
  'modeling',
  'sheet',
  'rules',
  'translate'
];

// helpers ///////////

function isCell(element) {
  return element instanceof Cell;
}