
// eslint-disable-next-line
import Inferno from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class ContextMenu {
  constructor(components, contextMenu, editorActions, eventBus, elementRegistry, modeling, sheet) {
    this._contextMenu = contextMenu;
    this._editorActions = editorActions;
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._modeling = modeling;
    this._sheet = sheet;

    this._onClick = this._onClick.bind(this);
    this._getEntries = this._getEntries.bind(this);

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'context-menu') {
        const entries = this._getEntries(context);

        return () => (
          <div>
            { entries }
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

      window.addEventListener('click', this._onClick);
    });
  }

  _onClick(event) {
    // if (!event.target.closest('.context-menu')) {
    //   this._contextMenu.close();

    //   window.removeEventListener('click', this._onClick);
    // }
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

      entries.push(
        <div className="context-menu-group">
          <h4 className="context-menu-group-title">Rule</h4>
          <div className="context-menu-group-entry">
            <div
              class="context-menu-group-entry-part"
              onClick={ () => handlers.addRuleAbove(element.row) }>
              <span className="context-menu-group-entry-icon">+</span>
              Add Above
            </div>
            <div
              class="context-menu-group-entry-part"
              onClick={ () => handlers.addRuleBelow(element.row) }>
              Below
            </div>
          </div>
          <div className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' }` }>
            <div
              className="context-menu-group-entry-part"
              onClick={ () => handlers.removeRule(element.row) }>
              <span className="context-menu-group-entry-icon">-</span>
              Remove
            </div>
          </div>
        </div>
      );
    }

    if (is(element, 'dmn:InputClause') || is(element.col, 'dmn:InputClause')) {
      const actualElement = is(element, 'dmn:InputClause') ? element : element.col;

      const canDelete = businessObject.input.length > 1;

      entries.push(
        <div className="context-menu-group">
          <h4 className="context-menu-group-title">Input</h4>
          <div className="context-menu-group-entry">
            <div
              className="context-menu-group-entry-part"
              onClick={ () => handlers.addInputLeft(actualElement) }>
              <span className="context-menu-group-entry-icon">+</span>
              Add Left
            </div>
            <div
              className="context-menu-group-entry-part"
              onClick={ () => handlers.addInputRight(actualElement) }>
              Right
            </div>
          </div>
          <div className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' }` }>
            <div
              class="context-menu-group-entry-part"
              onClick={ () => handlers.removeInput(actualElement) }>
              <span className="context-menu-group-entry-icon">-</span>
              Remove
            </div>
          </div>
        </div>
      );
    } else if (is(element, 'dmn:OutputClause') || is(element.col, 'dmn:OutputClause')) {
      const actualElement = is(element, 'dmn:OutputClause') ? element : element.col;

      const canDelete = businessObject.output.length > 1;

      entries.push(
        <div className="context-menu-group">
          <h4 className="context-menu-group-title">Output</h4>
          <div className="context-menu-group-entry">
            <div
              className="context-menu-group-entry-part"
              onClick={ () => handlers.addOutputLeft(actualElement) }>
              <span className="context-menu-group-entry-icon">+</span>
              Add Left
            </div>
            <div
              className="context-menu-group-entry-part"
              onClick={ () => handlers.addOutputRight(actualElement) }>
              Right
            </div>
          </div>
          <div className={ `context-menu-group-entry ${ canDelete ? '' : 'disabled' }` }>
            <div
              class="context-menu-group-entry-part"
              onClick={ () => handlers.removeOutput(actualElement) }>
              <span className="context-menu-group-entry-icon">-</span>
              Remove
            </div>
          </div>
        </div>
      );
    }

    return entries;
  }
}

ContextMenu.$inject = [ 'components', 'contextMenu', 'editorActions', 'eventBus', 'elementRegistry', 'modeling', 'sheet' ];