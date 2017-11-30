import Viewer from './Viewer';

import addInputOutputModule from './features/add-input-output';
import addRuleModule from './features/add-rule';
import annotationsEditorModule from './features/annotations/editor';
import contextMenuModule from 'table-js/lib/features/context-menu';
import decisionTableContextMenu from './features/context-menu';
import decisionTableEditorActionsModule from './features/editor-actions';
import decisionTableHeadEditorModule from './features/decision-table-head/editor';
import decisionTablePropertiesEditorModule from './features/decision-table-properties/editor';
import editorActionsModule from 'table-js/lib/features/editor-actions';
import hitPolicyEditorModule from './features/hit-policy/editor';
import inputExpressionModule from './features/input-expression';
import interactionEventsModule from 'table-js/lib/features/interaction-events';
import modelingModule from './features/modeling';
import rulesEditorModule from './features/rules/editor';
import selectionModule from 'table-js/lib/features/selection';
import typeRefModule from './features/type-ref';


export default class Editor extends Viewer {

  getModules() {
    return [
      ...Viewer._getModules(),
      ...Editor._getModules()
    ];
  }

  static _getModules() {
    return [
      addInputOutputModule,
      addRuleModule,
      annotationsEditorModule,
      contextMenuModule,
      decisionTableContextMenu,
      decisionTableEditorActionsModule,
      decisionTableHeadEditorModule,
      decisionTablePropertiesEditorModule,
      editorActionsModule,
      hitPolicyEditorModule,
      inputExpressionModule,
      interactionEventsModule,
      modelingModule,
      rulesEditorModule,
      selectionModule,
      typeRefModule
    ];
  }

}