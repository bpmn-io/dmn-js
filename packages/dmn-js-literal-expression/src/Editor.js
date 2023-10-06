import { DmnVariableResolverModule } from '@bpmn-io/dmn-variable-resolver';

import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';
import DataTypesModule from 'dmn-js-shared/lib/features/data-types';

import Viewer from './Viewer';

import DecisionPropertiesEditorModule from './features/decision-properties/editor';
import KeyboardModule from './features/keyboard';
import LiteralExpressionPropertiesEditorModule
  from './features/literal-expression-properties/editor';
import ModelingModule from './features/modeling';
import TextareaEditorComponent from './features/textarea/editor';

export default class Editor extends Viewer {
  getModules() {
    return [
      ...Viewer._getModules(),
      ...Editor._getModules()
    ];
  }

  static _getModules() {
    return [
      DecisionPropertiesEditorModule,
      KeyboardModule,
      LiteralExpressionPropertiesEditorModule,
      ModelingModule,
      ExpressionLanguagesModule,
      DataTypesModule,
      TextareaEditorComponent,
      DmnVariableResolverModule
    ];
  }
}