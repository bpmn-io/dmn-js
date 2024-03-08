import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { withChangeSupport } from '../../../util/withChangeSupport';

export const FunctionDefinitionEditorComponent = withChangeSupport(
  _FunctionDefinitionEditorComponent,
  props => [ props.expression ]
);

function _FunctionDefinitionEditorComponent({ expression }, context) {
  const functionDefinition = context.injector.get('functionDefinition');

  const parameters = functionDefinition.getParameters(expression);
  const body = functionDefinition.getBody(expression);

  const addParameter = () => {
    functionDefinition.addParameter(expression);
  };

  const removeParameter = parameter => {
    functionDefinition.removeParameter(expression, parameter);
  };

  return (
    <div className="function-definition">
      <FormalParameters
        add={ addParameter }
        remove={ removeParameter }
        parameters={ parameters }
      />
      <BodyExpression expression={ body } />
    </div>
  );
}

function FormalParameters({ add, parameters, remove }) {
  return (
    <div className="function-definition-parameters">
      <h2>Parameters</h2>
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
      <button type="button" onClick={ add }>Add parameter</button>
    </div>
  );
}

const Parameter = withChangeSupport(function({ parameter, remove }, context) {
  const dataTypes = context.injector.get('dataTypes');
  const translate = context.injector.get('translate');
  const functionDefinition = context.injector.get('functionDefinition');

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
        <Input onInput={ onNameChange } value={ parameter.get('name') } />
      </td>
      <td>
        <InputSelect
          onChange={ onTypeRefChange }
          value={ parameter.get('typeRef') }
          options={ typeRefOptions }
        />
      </td>
      <td>
        <button type="button" onClick={ remove }>Remove</button>
      </td>
    </tr>
  );
}, props => [ props.parameter ]);

function BodyExpression({ expression }, context) {
  const Expression = context.components.getComponent('expression', {
    expression
  });

  return (
    <div className="function-definition-body">
      <h2>Expression</h2>
      <Expression expression={ expression } />
    </div>
  );
}