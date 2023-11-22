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
      selection,
      sheet,
      rules,
      translate) {

    this._contextMenu = contextMenu;
    this._clipboard = clipboard;
    this._editorActions = editorActions;
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._modeling = modeling;
    this._selection = selection;
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
              { (entries || []).concat(cellEntriesGroup) }
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
        event,
        id
      });
    });
  }

  _getEntries(context) {
    const handlers = {
      addRuleAbove: (rule) => {
        const selectedIndex = rule.cells.map(cell => cell.id).indexOf(context.id);
        const newRule = this._editorActions.trigger('addRuleAbove', { rule });

        if (newRule.cells[selectedIndex]) {
          this._selection.select(newRule.cells[selectedIndex]);
        } else {
          this._selection.select(newRule.cells[0]);
        }

        this._contextMenu.close();
      },
      addRuleBelow: (rule) => {
        const selectedIndex = rule.cells.map(cell => cell.id).indexOf(context.id);
        const newRule = this._editorActions.trigger('addRuleBelow', { rule });

        if (newRule.cells[selectedIndex]) {
          this._selection.select(newRule.cells[selectedIndex]);
        } else {
          this._selection.select(newRule.cells[0]);
        }

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

    const row = element.row || element;
    if (is(row, 'dmn:DecisionRule')) {
      const canPaste = this._rules.allowed('paste', {
        data: clipboardData.elements,
        target: row
      });

      entries.push(
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-copy-rule"
            onClick={ () => handlers.copy(row) }>
            { this._translate('Copy rule') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-cut-rule"
            onClick={ () => handlers.cut(row) }>
            { this._translate('Cut rule') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-rule-above` }
            onClick={ () => handlers.pasteBefore(row) }>
            { this._translate('Paste rule above') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-rule-below` }
            onClick={ () => handlers.pasteAfter(row) }>
            { this._translate('Paste rule below') }
          </div>
        </div>,
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-add-rule-above"
            onClick={ () => handlers.addRuleAbove(row) }>
            { this._translate('Add rule above') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-rule-below"
            onClick={ () => handlers.addRuleBelow(row) }>
            { this._translate('Add rule below') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-remove-rule"
            onClick={ () => handlers.removeRule(row) }>
            { this._translate('Remove rule') }
          </div>
        </div>
      );
    } else if (is(element, 'dmn:InputClause')) {
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
            { this._translate('Copy input column') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canRemove ? '' : 'disabled' } context-menu-entry-cut-input` }
            onClick={ () => handlers.cut(actualElement) }>
            { this._translate('Cut input column') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-input-left` }
            onClick={ () => handlers.pasteBefore(actualElement) }>
            { this._translate('Paste input column left') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-input-right` }
            onClick={ () => handlers.pasteAfter(actualElement) }>
            { this._translate('Paste input column right') }
          </div>
        </div>,
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-add-input-left"
            onClick={ () => handlers.addInputLeft(actualElement) }>
            { this._translate('Add input column left') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-input-right"
            onClick={ () => handlers.addInputRight(actualElement) }>
            { this._translate('Add input column right') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canRemove ? '' : 'disabled' } context-menu-entry-remove-input` }
            onClick={ () => handlers.removeInput(actualElement) }>
            { this._translate('Remove input column') }
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
            { this._translate('Copy output column') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canRemove ? '' : 'disabled' } context-menu-entry-cut-output` }
            onClick={ () => handlers.cut(actualElement) }>
            { this._translate('Cut output column') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-output-left` }
            onClick={ () => handlers.pasteBefore(actualElement) }>
            { this._translate('Paste output column left') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canPaste ? '' : 'disabled' } context-menu-entry-paste-output-right` }
            onClick={ () => handlers.pasteAfter(actualElement) }>
            { this._translate('Paste output column right') }
          </div>
        </div>,
        <div className="context-menu-group">
          <div
            className="context-menu-group-entry context-menu-entry-add-output-left"
            onClick={ () => handlers.addOutputLeft(actualElement) }>
            { this._translate('Add output column left') }
          </div>
          <div
            className="context-menu-group-entry context-menu-entry-add-output-right"
            onClick={ () => handlers.addOutputRight(actualElement) }>
            { this._translate('Add output column right') }
          </div>
          <div
            className={ `context-menu-group-entry ${ canRemove ? '' : 'disabled' } context-menu-entry-remove-output` }
            onClick={ () => handlers.removeOutput(actualElement) }>
            { this._translate('Remove output column') }
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
  'selection',
  'sheet',
  'rules',
  'translate'
];

// helpers ///////////

function isCell(element) {
  return element instanceof Cell;
}