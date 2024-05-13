import { DmnVariableResolverModule } from '@bpmn-io/dmn-variable-resolver';

import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';
import DataTypesModule from 'dmn-js-shared/lib/features/data-types';

import { Viewer } from './Viewer';

import KeyboardModule from './features/keyboard';
import ModelingModule from './features/modeling';
import LiteralExpressionEditorComponent from './features/literal-expression/editor';
import FunctionDefinitionEditorModule from './features/function-definition/editor';
import ElementPropertiesModule from './features/element-properties/editor';
import CoreModule from './core';
import ElementVariableModule from './features/element-variable/editor';
import EditorActionsModule from './features/editor-actions';

export class Editor extends Viewer {
  getModules() {
    return [
      ...super.getModules(),
      CoreModule,
      ModelingModule,
      EditorActionsModule,
      ElementPropertiesModule,
      FunctionDefinitionEditorModule,
      ExpressionLanguagesModule,
      LiteralExpressionEditorComponent,
      KeyboardModule,
      DataTypesModule,
      ElementVariableModule,
      DmnVariableResolverModule
    ];
  }
}