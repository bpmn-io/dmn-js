import Viewer from './Viewer';

import addInputOutputModule from './features/add-input-output';
import addRuleModule from './features/add-rule';
import annotationsEditorModule from './features/annotations/editor';
import clipboardModule from 'table-js/lib/features/clipboard';
import contextMenuModule from 'table-js/lib/features/context-menu';
import cutPasteModule from 'table-js/lib/features/cut-paste';
import decisionTableContextMenu from './features/context-menu';
import decisionTableEditorActionsModule from './features/editor-actions';
import expressionLanguageModule from './features/expression-language';
import tableHeadEditorModule from './features/decision-table-head/editor';
import tablePropertiesEditorModule from './features/decision-table-properties/editor';
import editorActionsModule from 'table-js/lib/features/editor-actions';
import hitPolicyEditorModule from './features/hit-policy/editor';
import inputExpressionModule from './features/input-expression';
import inputOutputValuesModule from './features/input-output-values';
import interactionEventsModule from 'table-js/lib/features/interaction-events';
import modelingModule from './features/modeling';
import rulesEditorModule from './features/rules/editor';
import selectionModule from 'table-js/lib/features/selection';
import simpleModeModule from './features/simple-mode';
import simpleBooleanEditModule from './features/simple-boolean-edit';
import simpleDateEditModule from './features/simple-date-edit';
import simpleNumberEditModule from './features/simple-number-edit';
import simpleStringEditModule from './features/simple-string-edit';
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
      clipboardModule,
      contextMenuModule,
      cutPasteModule,
      decisionTableContextMenu,
      decisionTableEditorActionsModule,
      expressionLanguageModule,
      tableHeadEditorModule,
      tablePropertiesEditorModule,
      editorActionsModule,
      hitPolicyEditorModule,
      inputExpressionModule,
      inputOutputValuesModule,
      interactionEventsModule,
      modelingModule,
      rulesEditorModule,
      selectionModule,
      simpleModeModule,
      simpleBooleanEditModule,
      simpleDateEditModule,
      simpleNumberEditModule,
      simpleStringEditModule,
      typeRefModule
    ];
  }

}