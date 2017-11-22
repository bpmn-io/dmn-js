import DecisionTable from './DecisionTable';

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
import interactionEventsModule from 'table-js/lib/features/interaction-events';
import modelingModule from './features/modeling';
import rulesEditorModule from './features/rules/editor';
import selectionModule from 'table-js/lib/features/selection';


export default class DecisionTableEditor extends DecisionTable {

  getModules() {
    return [
      ...DecisionTable._getModules(),
      ...DecisionTableEditor._getModules()
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
      interactionEventsModule,
      modelingModule,
      rulesEditorModule,
      selectionModule
    ];
  }

}