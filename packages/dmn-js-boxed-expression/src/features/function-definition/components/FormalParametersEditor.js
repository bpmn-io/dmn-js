import InputSelect from 'dmn-js-shared/lib/components/InputSelect';
import Input from 'dmn-js-shared/lib/components/Input';

import { withChangeSupport } from '../../../util/withChangeSupport';

export class FormalParametersEditorProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('context-menu', (context = {}) => {
      if (
        context.contextMenuType &&
        context.contextMenuType === 'formal-parameters-editor'
      ) {
        return FormalParametersEditor;
      }
    });
  }
}

const FormalParametersEditor = withChangeSupport(
  _FormalParametersEditor,
  props => [ props.context.expression ]
);

function _FormalParametersEditor({ context: { expression } }, context) {
  const functionDefinition = context.injector.get('functionDefinition');
  const translate = context.injector.get('translate');

  const parameters = functionDefinition.getParameters(expression);

  const remove = parameter => {
    functionDefinition.removeParameter(expression, parameter);
  };

  const add = () => {
    functionDefinition.addParameter(expression);
  };


  return (
    <div className="context-menu-container formal-parameters">
      <h3>{translate('Edit formal parameters')}</h3>
      {
        parameters.length ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {
                parameters.map((parameter, idx) => (
                  <Parameter
                    key={ idx }
                    parameter={ parameter }
                    remove={ () => remove(parameter) }
                  />
                ))
              }
            </tbody>
          </table>
        ) : null
      }
      <button type="button" onClick={ add } className="add-parameter">
        { translate('Add parameter') }
      </button>
    </div>
  );
}

const Parameter = withChangeSupport(function({ parameter, remove }, context) {
  const dataTypes = context.injector.get('dataTypes');
  const translate = context.injector.get('translate');
  const functionDefinition = context.injector.get('functionDefinition');

  const { name, typeRef } = parameter;

  const onNameChange = name => {
    functionDefinition.updateParameter(parameter, { name });
  };

  const onTypeRefChange = typeRef => {
    functionDefinition.updateParameter(parameter, { typeRef });
  };

  const typeRefOptions = dataTypes.getAll().map(t => {
    return {
      label: translate(t),
      value: t
    };
  });

  return (
    <tr className="function-definition-parameter">
      <td>
        <Input onChange={ onNameChange } value={ name } />
      </td>
      <td>
        <InputSelect
          onChange={ onTypeRefChange }
          value={ typeRef }
          options={ typeRefOptions }
        />
      </td>
      <td>
        <button
          type="button"
          className="dmn-icon-trash"
          onClick={ remove }
          aria-label={ translate('Remove parameter') }
        />
      </td>
    </tr>
  );
}, props => [ props.parameter ]);