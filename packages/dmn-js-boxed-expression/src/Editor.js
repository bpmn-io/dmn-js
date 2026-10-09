import { DmnVariableResolverModule } from '@bpmn-io/dmn-variable-resolver';

import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';
import FeelLanguageContextModule from 'dmn-js-shared/lib/features/feel-language-context';
import DataTypesModule from 'dmn-js-shared/lib/features/data-types';

import { Viewer } from './Viewer';

import ContextMenuModule from 'table-js/lib/features/context-menu';

import AddRuleModule from './features/add-rule';
import AnnotationsEditorModule from './features/annotations/editor';
import CellSelectionModule from './features/cell-selection';
import ColumnResizeModule from './features/column-resize';
import CopyCutPasteKeyBindingsModule from './features/copy-cut-paste/key-bindings';
import CopyCutPasteModule from './features/copy-cut-paste';
import CreateInputsModule from './features/create-inputs';
import DecisionRulesEditorModule from './features/decision-rules/editor';
import DecisionTableContextMenuModule from './features/context-menu';
import DecisionTableHeadEditorModule from './features/decision-table-head/editor';
import DescriptionModule from './features/description';
import DragAndDropModule from './features/drag-and-drop';
import EditorActionsModule from './features/editor-actions';
import ElementPropertiesModule from './features/element-properties/editor';
import ElementVariableModule from './features/element-variable/editor';
import ExpressionLanguageModule from './features/expression-language';
import FunctionDefinitionEditorModule from './features/function-definition/editor';
import HitPolicyEditorModule from './features/hit-policy/editor';
import KeyboardModule from './features/keyboard';
import LiteralExpressionEditorComponent from './features/literal-expression/editor';
import ModelingModule from './features/modeling';
import SimpleBooleanEditModule from './features/simple-boolean-edit';
import SimpleDateEditModule from './features/simple-date-edit';
import SimpleDateTimeEditModule from './features/simple-date-time-edit';
import SimpleDurationEditModule from './features/simple-duration-edit';
import SimpleModeModule from './features/simple-mode';
import SimpleNumberEditModule from './features/simple-number-edit';
import SimpleStringEditModule from './features/simple-string-edit';
import SimpleTimeEditModule from './features/simple-time-edit';

export class Editor extends Viewer {
  getModules() {
    return [
      ...super.getModules(),
      AddRuleModule,
      AnnotationsEditorModule,
      CellSelectionModule,
      ColumnResizeModule,
      ContextMenuModule,
      CopyCutPasteKeyBindingsModule,
      CopyCutPasteModule,
      CreateInputsModule,
      DataTypesModule,
      DecisionRulesEditorModule,
      DecisionTableContextMenuModule,
      DecisionTableHeadEditorModule,
      DescriptionModule,
      DmnVariableResolverModule,
      DragAndDropModule,
      EditorActionsModule,
      ElementPropertiesModule,
      ElementVariableModule,
      ExpressionLanguageModule,
      ExpressionLanguagesModule,
      FeelLanguageContextModule,
      FunctionDefinitionEditorModule,
      HitPolicyEditorModule,
      KeyboardModule,
      LiteralExpressionEditorComponent,
      ModelingModule,
      SimpleBooleanEditModule,
      SimpleDateEditModule,
      SimpleDateTimeEditModule,
      SimpleDurationEditModule,
      SimpleModeModule,
      SimpleNumberEditModule,
      SimpleStringEditModule,
      SimpleTimeEditModule
    ];
  }
}